from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: str
    user_id: str
    booking_id: str | None = None
    traveler_id: str | None = None
    document_type: str
    original_filename: str
    stored_filename: str
    mime_type: str
    file_size: int
    storage_bucket: str
    storage_key: str
    is_private: bool
    uploaded_at: datetime