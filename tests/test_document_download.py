from io import BytesIO

from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.user import User


def create_user(client, db_session, email: str, username: str):
    user = User(
        email=email,
        username=username,
        full_name=username,
        password_hash=get_password_hash("Password123"),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    db_session.add(user)
    db_session.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "Password123"},
    )
    return user, resp.json()["access_token"]


def test_document_download_requires_ownership(client, db_session, sample_pdf_bytes):
    _, token1 = create_user(client, db_session, "u1@example.com", "u1")
    _, token2 = create_user(client, db_session, "u2@example.com", "u2")

    upload_resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token1}"},
        files={"file": ("passport.pdf", BytesIO(sample_pdf_bytes), "application/pdf")},
        data={"document_type": "passport"},
    )
    assert upload_resp.status_code == 201
    document_id = upload_resp.json()["id"]

    download_resp = client.get(
        f"/api/v1/uploads/documents/{document_id}/download",
        headers={"Authorization": f"Bearer {token2}"},
    )
    assert download_resp.status_code == 404


def test_document_download_returns_original_file(client, db_session, sample_pdf_bytes):
    _, token = create_user(client, db_session, "u3@example.com", "u3")

    upload_resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("passport.pdf", BytesIO(sample_pdf_bytes), "application/pdf")},
        data={"document_type": "passport"},
    )
    assert upload_resp.status_code == 201
    document_id = upload_resp.json()["id"]

    download_resp = client.get(
        f"/api/v1/uploads/documents/{document_id}/download",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert download_resp.status_code == 200
    assert download_resp.headers["content-type"].startswith("application/pdf")
    assert "passport.pdf" in download_resp.headers["content-disposition"]
    assert download_resp.content == sample_pdf_bytes
