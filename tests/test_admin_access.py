from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.user import User


def test_non_admin_cannot_access_admin_users(client, db_session):
    user = User(
        email="plain@example.com",
        username="plain",
        full_name="Plain User",
        password_hash=get_password_hash("Password123"),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    db_session.add(user)
    db_session.commit()

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "plain@example.com", "password": "Password123"},
    )
    token = login.json()["access_token"]

    resp = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Admin access required"