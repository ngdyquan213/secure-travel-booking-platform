# import os
# import tempfile
# from collections.abc import Generator

# import pytest
# from fastapi.testclient import TestClient
# from sqlalchemy import create_engine
# from sqlalchemy.orm import Session, sessionmaker

# from app.core.database import get_db
# from app.main import app
# from app.models import Base


# @pytest.fixture(scope="session")
# def db_engine():
#     db_fd, db_path = tempfile.mkstemp(suffix=".db")
#     os.close(db_fd)

#     engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
#     Base.metadata.create_all(bind=engine)

#     yield engine

#     engine.dispose()
#     os.remove(db_path)


# @pytest.fixture()
# def db_session(db_engine) -> Generator[Session, None, None]:
#     TestingSessionLocal = sessionmaker(
#         autocommit=False,
#         autoflush=False,
#         bind=db_engine,
#     )
#     db = TestingSessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @pytest.fixture()
# def client(db_session: Session) -> Generator[TestClient, None, None]:
#     def override_get_db():
#         try:
#             yield db_session
#         finally:
#             pass

#     app.dependency_overrides[get_db] = override_get_db

#     with TestClient(app) as c:
#         yield c

#     app.dependency_overrides.clear()

from collections.abc import Generator
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import get_db
from app.main import app
from app.models import Base

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
ADMIN_DB_NAME = os.getenv("POSTGRES_ADMIN_DB", "template1")
TEST_DB_NAME = os.getenv("TEST_DB_NAME", "secure_travel_booking_test")

TEST_DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{TEST_DB_NAME}"
)


def ensure_test_database_exists():
    admin_url = URL.create(
        drivername="postgresql+psycopg2",
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=ADMIN_DB_NAME,
    )

    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": TEST_DB_NAME},
        ).scalar()

        if not exists:
            conn.execute(text(f'CREATE DATABASE "{TEST_DB_NAME}"'))

    admin_engine.dispose()


@pytest.fixture(scope="session")
def db_engine():
    ensure_test_database_exists()

    engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)

    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()

    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def db_session(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=connection,
    )
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.clear()