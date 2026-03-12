from __future__ import annotations

import uuid
from pathlib import Path

from app.core.config import settings


def validate_file(filename: str, mime_type: str) -> None:
    ext = Path(filename).suffix.lower()

    if not filename.strip():
        raise ValueError("Filename is required")

    if ext not in settings.allowed_upload_extensions_list:
        raise ValueError("File extension is not allowed")

    if mime_type.lower() not in settings.allowed_upload_mime_types_list:
        raise ValueError("File MIME type is not allowed")


def generate_stored_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix.lower() or ".bin"
    return f"{uuid.uuid4().hex}{ext}"