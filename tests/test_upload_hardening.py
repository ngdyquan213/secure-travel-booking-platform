from io import BytesIO

from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.user import User


def create_user_and_login(client, db_session, *, email: str, username: str, password: str = "Password123"):
    user = User(
        email=email,
        username=username,
        full_name=username,
        password_hash=get_password_hash(password),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    db_session.add(user)
    db_session.commit()

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    return user, token


def test_upload_rejects_empty_file(client, db_session, monkeypatch, tmp_path):
    from app.core import config as config_module

    monkeypatch.setattr(config_module.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))

    _, token = create_user_and_login(
        client,
        db_session,
        email="upload-empty@example.com",
        username="upload_empty",
    )

    resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("empty.pdf", BytesIO(b""), "application/pdf")},
        data={"document_type": "passport"},
    )

    assert resp.status_code == 400
    body = resp.json()
    assert body["error_code"] == "VALIDATION_ERROR"
    assert body["message"] == "Uploaded file is empty"


def test_upload_rejects_file_too_large(client, db_session, monkeypatch, tmp_path):
    from app.core import config as config_module

    monkeypatch.setattr(config_module.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr(config_module.settings, "MAX_UPLOAD_SIZE_BYTES", 10)

    _, token = create_user_and_login(
        client,
        db_session,
        email="upload-large@example.com",
        username="upload_large",
    )

    resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("large.pdf", BytesIO(b"0123456789ABCDEF"), "application/pdf")},
        data={"document_type": "passport"},
    )

    assert resp.status_code == 400
    body = resp.json()
    assert body["error_code"] == "VALIDATION_ERROR"
    assert body["message"] == "Uploaded file exceeds maximum allowed size"


def test_upload_rejects_invalid_extension(client, db_session, monkeypatch, tmp_path):
    from app.core import config as config_module

    monkeypatch.setattr(config_module.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))

    _, token = create_user_and_login(
        client,
        db_session,
        email="upload-ext@example.com",
        username="upload_ext",
    )

    resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("malware.exe", BytesIO(b"fake-binary"), "application/pdf")},
        data={"document_type": "passport"},
    )

    assert resp.status_code == 400
    body = resp.json()
    assert body["error_code"] == "VALIDATION_ERROR"
    assert body["message"] == "File extension is not allowed"


def test_upload_rejects_invalid_mime_type(client, db_session, monkeypatch, tmp_path):
    from app.core import config as config_module

    monkeypatch.setattr(config_module.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))

    _, token = create_user_and_login(
        client,
        db_session,
        email="upload-mime@example.com",
        username="upload_mime",
    )

    resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("file.pdf", BytesIO(b"%PDF-1.4 fake"), "text/plain")},
        data={"document_type": "passport"},
    )

    assert resp.status_code == 400
    body = resp.json()
    assert body["error_code"] == "VALIDATION_ERROR"
    assert body["message"] == "File MIME type is not allowed"


def test_upload_accepts_valid_file(client, db_session, monkeypatch, tmp_path):
    from app.core import config as config_module

    monkeypatch.setattr(config_module.settings, "LOCAL_UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr(config_module.settings, "MAX_UPLOAD_SIZE_BYTES", 1024 * 1024)

    _, token = create_user_and_login(
        client,
        db_session,
        email="upload-ok@example.com",
        username="upload_ok",
    )

    content = b"%PDF-1.4 test content"

    resp = client.post(
        "/api/v1/uploads/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("passport.pdf", BytesIO(content), "application/pdf")},
        data={"document_type": "passport"},
    )

    assert resp.status_code == 201
    body = resp.json()

    assert body["document_type"] == "passport"
    assert body["original_filename"] == "passport.pdf"
    assert body["mime_type"] == "application/pdf"
    assert body["file_size"] == len(content)
    assert body["storage_bucket"] == "local"

    stored_path = body["storage_key"]
    assert stored_path