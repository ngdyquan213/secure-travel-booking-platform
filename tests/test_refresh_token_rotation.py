from collections import Counter
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy.orm import sessionmaker

from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.user import User
from app.repositories.audit_repository import AuditRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest
from app.services.audit_service import AuditService
from app.services.auth_service import AuthService


def test_refresh_token_rotation_returns_new_refresh_token(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation1@example.com",
            "username": "rotation1",
            "full_name": "Rotation User 1",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation1@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    old_refresh_token = login_resp.json()["refresh_token"]

    refresh_resp = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert refresh_resp.status_code == 200

    body = refresh_resp.json()
    new_refresh_token = body["refresh_token"]

    assert new_refresh_token != old_refresh_token
    assert "access_token" in body


def test_old_refresh_token_cannot_be_reused_after_rotation(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation2@example.com",
            "username": "rotation2",
            "full_name": "Rotation User 2",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation2@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    old_refresh_token = login_resp.json()["refresh_token"]

    first_refresh = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert first_refresh.status_code == 200

    reuse_old = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": old_refresh_token},
    )
    assert reuse_old.status_code == 401


def test_new_refresh_token_can_continue_session_after_rotation(client, db_session):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "rotation3@example.com",
            "username": "rotation3",
            "full_name": "Rotation User 3",
            "password": "Password123",
        },
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "rotation3@example.com",
            "password": "Password123",
        },
    )
    assert login_resp.status_code == 200
    refresh_token_1 = login_resp.json()["refresh_token"]

    refresh_resp_1 = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token_1},
    )
    assert refresh_resp_1.status_code == 200
    refresh_token_2 = refresh_resp_1.json()["refresh_token"]

    refresh_resp_2 = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token_2},
    )
    assert refresh_resp_2.status_code == 200
    refresh_token_3 = refresh_resp_2.json()["refresh_token"]

    assert refresh_token_3 != refresh_token_2


def test_refresh_token_rotation_is_single_use_under_concurrency(db_engine):
    SessionLocal = sessionmaker(bind=db_engine, autocommit=False, autoflush=False)

    seed_session = SessionLocal()
    service = AuthService(
        db=seed_session,
        user_repo=UserRepository(seed_session),
        audit_service=AuditService(AuditRepository(seed_session)),
    )
    payload = LoginRequest(email="rotation-concurrent@example.com", password="Password123")

    user = User(
        email=payload.email,
        username="rotation_concurrent",
        full_name="Rotation Concurrent",
        password_hash=get_password_hash(payload.password),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    seed_session.add(user)
    seed_session.commit()

    _, _, refresh_token = service.login(payload=payload)
    seed_session.close()

    def rotate_once() -> tuple[str, str | None]:
        session = SessionLocal()
        service = AuthService(
            db=session,
            user_repo=UserRepository(session),
            audit_service=AuditService(AuditRepository(session)),
        )

        try:
            _user, _access_token, new_refresh_token = service.refresh_access_token(
                refresh_token=refresh_token
            )
            return "success", new_refresh_token
        except Exception as exc:
            return "error", str(exc)
        finally:
            session.close()

    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(lambda _unused: rotate_once(), range(2)))

    statuses = Counter(status for status, _value in results)
    assert statuses["success"] == 1
    assert statuses["error"] == 1
    assert any(
        value == "Refresh token has been revoked" for status, value in results if status == "error"
    )
