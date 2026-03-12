from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_pagination_params
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.document_repository import DocumentRepository
from app.schemas.common import PaginatedResponse
from app.schemas.document import DocumentResponse
from app.services.audit_service import AuditService
from app.services.upload_service import UploadService
from app.utils.pagination import PaginationParams, build_paginated_response
from app.utils.response_mappers import document_to_dict

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    request: Request,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    booking_id: str | None = Form(default=None),
    traveler_id: str | None = Form(default=None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    audit_service = AuditService(AuditRepository(db))
    service = UploadService(
        db=db,
        document_repo=DocumentRepository(db),
        audit_service=audit_service,
        booking_repo=BookingRepository(db),
    )

    document = service.upload_document(
        user_id=str(current_user.id),
        file=file,
        document_type=document_type,
        booking_id=booking_id,
        traveler_id=traveler_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return DocumentResponse(**document_to_dict(document))


@router.get("/documents", response_model=PaginatedResponse)
def list_my_documents(
    current_user=Depends(get_current_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
):
    repo = DocumentRepository(db)

    total = repo.count_by_user_id(str(current_user.id))
    documents = repo.list_by_user_id(
        str(current_user.id),
        skip=pagination.offset,
        limit=pagination.limit,
    )

    items = [document_to_dict(doc) for doc in documents]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/documents/{document_id}/download")
def download_document(
    document_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    audit_service = AuditService(AuditRepository(db))
    service = UploadService(
        db=db,
        document_repo=DocumentRepository(db),
        audit_service=audit_service,
        booking_repo=BookingRepository(db),
    )

    document = service.get_my_document(
        user_id=str(current_user.id),
        document_id=document_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    file_path = Path(document.storage_key)

    return FileResponse(
        path=file_path,
        media_type=document.mime_type,
        filename=document.original_filename,
    )