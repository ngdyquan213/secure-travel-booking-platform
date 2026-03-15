from io import BytesIO
from pathlib import Path
from types import SimpleNamespace

from app.core.security import get_password_hash
from app.models.document import UploadedDocument
from app.models.enums import DocumentType, UserStatus
from app.models.user import User
from app.services.storage_service import StorageService


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


def test_document_download_rejects_poisoned_absolute_storage_key(client, db_session, tmp_path):
    user, token = create_user(client, db_session, "u4@example.com", "u4")
    poisoned_file = tmp_path / "poisoned.pdf"
    poisoned_file.write_bytes(b"not actually used")

    document = UploadedDocument(
        user_id=user.id,
        booking_id=None,
        traveler_id=None,
        document_type=DocumentType.passport,
        original_filename="passport.pdf",
        stored_filename="passport.pdf",
        mime_type="application/pdf",
        file_size=poisoned_file.stat().st_size,
        storage_bucket="local",
        storage_key=str(Path(poisoned_file).resolve()),
        checksum_sha256=None,
        is_private=True,
    )
    db_session.add(document)
    db_session.commit()

    download_resp = client.get(
        f"/api/v1/uploads/documents/{document.id}/download",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert download_resp.status_code == 404


def test_s3_download_sanitizes_content_disposition_filename():
    service = StorageService()

    class FakeS3Client:
        def get_object(self, Bucket, Key):
            return {"Body": BytesIO(b"safe-content")}

    service._s3_client = lambda: FakeS3Client()

    document = SimpleNamespace(
        storage_bucket="secure-bucket",
        storage_key="safe-key",
        mime_type="application/pdf",
        original_filename='evil"\r\nx-test: 1.pdf',
    )

    response = service.build_download_response(document=document)

    assert response.headers["content-disposition"] == 'attachment; filename="evil_x-test: 1.pdf"'
