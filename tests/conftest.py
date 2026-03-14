import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import get_db
from app.core.redis import redis_client
from app.main import app
from app.models import Base

pytest_plugins = ("tests.conftest_postgres",)

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
ADMIN_DB_NAME = os.getenv("POSTGRES_ADMIN_DB") or "secure_travel_booking"
TEST_DB_NAME = os.getenv("TEST_DB_NAME", f"secure_travel_booking_test_{os.getpid()}")

TEST_DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{TEST_DB_NAME}"
)

MINIMAL_PDF_BYTES = (
    b"%PDF-1.4\n"
    b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    b"3 0 obj\n"
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] "
    b"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\n"
    b"endobj\n"
    b"4 0 obj\n<< /Length 37 >>\nstream\n"
    b"BT /F1 18 Tf 50 120 Td (Test PDF) Tj ET\n"
    b"endstream\nendobj\n"
    b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    b"xref\n0 6\n"
    b"0000000000 65535 f \n"
    b"0000000009 00000 n \n"
    b"0000000058 00000 n \n"
    b"0000000115 00000 n \n"
    b"0000000241 00000 n \n"
    b"0000000328 00000 n \n"
    b"trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n398\n%%EOF\n"
)


def recreate_test_database() -> None:
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
        conn.execute(
            text(
                """
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = :name AND pid <> pg_backend_pid()
                """
            ),
            {"name": TEST_DB_NAME},
        )
        conn.execute(text(f'DROP DATABASE IF EXISTS "{TEST_DB_NAME}"'))
        conn.execute(text(f'CREATE DATABASE "{TEST_DB_NAME}" TEMPLATE template0'))

    admin_engine.dispose()


@pytest.fixture(scope="session")
def db_engine():
    recreate_test_database()

    engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)

    with engine.connect() as conn:
        Base.metadata.create_all(bind=conn)
        conn.commit()

    yield engine

    engine.dispose()


@pytest.fixture()
def db_session(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=connection,
        join_transaction_mode="create_savepoint",
    )
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        if transaction.is_active:
            transaction.rollback()
        connection.close()


@pytest.fixture(autouse=True)
def clear_test_redis_state():
    try:
        keys = list(redis_client.scan_iter(match="rl:*"))
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass
    yield
    try:
        keys = list(redis_client.scan_iter(match="rl:*"))
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    connection = db_session.connection()
    RequestSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    def override_get_db():
        request_db = RequestSessionLocal()
        try:
            yield request_db
        finally:
            request_db.close()

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.clear()


@pytest.fixture()
def sample_pdf_bytes() -> bytes:
    return MINIMAL_PDF_BYTES
