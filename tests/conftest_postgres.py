import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

from app.core.database import get_db
from app.main import app
from app.models.base import Base

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    f"postgresql+psycopg2://postgres:postgres@localhost:5432/secure_travel_booking_test_{os.getpid()}",
)

engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def recreate_test_database():
    db_user = os.getenv("POSTGRES_USER", "postgres")
    db_password = os.getenv("POSTGRES_PASSWORD", "postgres")
    db_host = os.getenv("POSTGRES_HOST", "localhost")
    db_port = int(os.getenv("POSTGRES_PORT", "5432"))
    admin_db_name = os.getenv("POSTGRES_ADMIN_DB") or "secure_travel_booking"
    test_db_name = os.getenv("TEST_DB_NAME", f"secure_travel_booking_test_{os.getpid()}")

    admin_url = URL.create(
        drivername="postgresql+psycopg2",
        username=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=admin_db_name,
    )

    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        conn.execute(
            text(
                """
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = :name AND pid <> pg_backend_pid()
                """
            ),
            {"name": test_db_name},
        )
        conn.execute(text(f'DROP DATABASE IF EXISTS "{test_db_name}"'))
        conn.execute(text(f'CREATE DATABASE "{test_db_name}" TEMPLATE template0'))
    admin_engine.dispose()


@pytest.fixture(scope="session")
def setup_postgres_test_db():
    recreate_test_database()
    with engine.connect() as conn:
        Base.metadata.create_all(bind=conn)
        conn.commit()
    yield


@pytest.fixture()
def db_session_pg(setup_postgres_test_db):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    try:
        yield session
    finally:
        session.close()
        if transaction.is_active:
            transaction.rollback()
        connection.close()


@pytest.fixture()
def client_pg(db_session_pg):
    def override_get_db():
        try:
            yield db_session_pg
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as client:
            yield client
    finally:
        app.dependency_overrides.clear()


@pytest.fixture()
def postgres_healthcheck():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
    return result
