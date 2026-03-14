from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import build_upload_service, get_current_user
from app.core.database import get_db
from app.models.enums import DocumentType
from app.repositories.document_repository import DocumentRepository
from app.schemas.document import DocumentResponse
from app.utils.request_context import get_client_ip, get_user_agent
from app.utils.response_mappers import document_to_dict

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    request: Request,
    file: UploadFile = File(...),
    document_type: DocumentType = Form(...),
    booking_id: str | None = Form(default=None),
    traveler_id: str | None = Form(default=None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    service = build_upload_service(db)

    document = service.upload_document(
        user_id=str(current_user.id),
        file=file,
        document_type=document_type,
        booking_id=booking_id,
        traveler_id=traveler_id,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )

    return DocumentResponse(**document_to_dict(document))


@router.get("/documents", response_model=list[DocumentResponse])
def list_my_documents(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repo = DocumentRepository(db)

    documents = repo.list_by_user_id(str(current_user.id), skip=0, limit=100)
    return [DocumentResponse(**document_to_dict(doc)) for doc in documents]


@router.get("/documents/{document_id}/download")
def download_document(
    document_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = build_upload_service(db)

    document = service.get_my_document(
        user_id=str(current_user.id),
        document_id=document_id,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )

    file_path = Path(document.storage_key)

    return FileResponse(
        path=file_path,
        media_type=document.mime_type,
        filename=document.original_filename,
    )
