from __future__ import annotations

from ipaddress import ip_address as parse_ip
import logging
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import NotFoundAppException, ValidationAppException
from app.models.document import UploadedDocument
from app.models.enums import DocumentType, LogActorType
from app.repositories.booking_repository import BookingRepository
from app.repositories.document_repository import DocumentRepository
from app.services.audit_service import AuditService
from app.utils.file_utils import generate_stored_filename, validate_file

logger = logging.getLogger("app.upload")

CHUNK_SIZE = 1024 * 1024


class UploadService:
    def __init__(
        self,
        db: Session,
        document_repo: DocumentRepository,
        audit_service: AuditService,
        booking_repo: BookingRepository | None = None,
    ) -> None:
        self.db = db
        self.document_repo = document_repo
        self.audit_service = audit_service
        self.booking_repo = booking_repo or BookingRepository(db)

    def _validate_booking_and_traveler_relation(
        self,
        *,
        user_id: str,
        booking_id: str | None,
        traveler_id: str | None,
    ) -> tuple[str | None, str | None]:
        resolved_booking_id = booking_id
        resolved_traveler_id = traveler_id

        if booking_id:
            booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
            if not booking:
                raise NotFoundAppException("Booking not found")

        if traveler_id:
            traveler = self.booking_repo.get_traveler_by_id_and_user_id(traveler_id, user_id)
            if not traveler:
                raise NotFoundAppException("Traveler not found")

            if booking_id and str(traveler.booking_id) != booking_id:
                raise ValidationAppException("Traveler does not belong to the provided booking")

            resolved_booking_id = booking_id or str(traveler.booking_id)
            resolved_traveler_id = traveler_id

        return resolved_booking_id, resolved_traveler_id

    def _save_upload_to_disk(self, file: UploadFile, destination: Path) -> int:
        total_written = 0

        try:
            with open(destination, "wb") as out:
                while True:
                    chunk = file.file.read(CHUNK_SIZE)
                    if not chunk:
                        break

                    total_written += len(chunk)
                    if total_written > settings.MAX_UPLOAD_SIZE_BYTES:
                        raise ValidationAppException("Uploaded file exceeds maximum allowed size")

                    out.write(chunk)
        except Exception:
            if destination.exists():
                destination.unlink(missing_ok=True)
            raise
        finally:
            file.file.seek(0)

        if total_written == 0:
            destination.unlink(missing_ok=True)
            raise ValidationAppException("Uploaded file is empty")

        return total_written

    @staticmethod
    def _normalize_ip(ip_value: str | None) -> str | None:
        if not ip_value:
            return None
        try:
            return str(parse_ip(ip_value))
        except ValueError:
            return None

    def upload_document(
        self,
        *,
        user_id: str,
        file: UploadFile,
        document_type: str,
        booking_id: str | None = None,
        traveler_id: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> UploadedDocument:
        try:
            document_type_enum = DocumentType(document_type)
        except ValueError as exc:
            raise ValidationAppException("Unsupported document type") from exc

        try:
            validate_file(file.filename or "", file.content_type or "")
        except ValueError as exc:
            raise ValidationAppException(str(exc)) from exc

        booking_id, traveler_id = self._validate_booking_and_traveler_relation(
            user_id=user_id,
            booking_id=booking_id,
            traveler_id=traveler_id,
        )

        upload_dir = Path(settings.LOCAL_UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)

        stored_filename = generate_stored_filename(file.filename or "file")
        storage_path = upload_dir / stored_filename
        normalized_ip = self._normalize_ip(ip_address)

        logger.info(
            "upload_started | filename=%s mime_type=%s user_id=%s booking_id=%s traveler_id=%s",
            file.filename,
            file.content_type,
            user_id,
            booking_id,
            traveler_id,
        )

        file_size = self._save_upload_to_disk(file, storage_path)

        try:
            document = UploadedDocument(
                user_id=user_id,
                booking_id=booking_id,
                traveler_id=traveler_id,
                document_type=document_type_enum,
                original_filename=file.filename or stored_filename,
                stored_filename=stored_filename,
                mime_type=file.content_type or "application/octet-stream",
                file_size=file_size,
                storage_bucket="local",
                storage_key=str(storage_path),
                is_private=True,
            )
            self.document_repo.add_document(document)
            self.db.flush()

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=user_id,
                action="document_uploaded",
                resource_type="uploaded_document",
                resource_id=document.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={
                    "document_type": document_type,
                    "original_filename": document.original_filename,
                    "booking_id": booking_id,
                    "traveler_id": traveler_id,
                    "storage_key": str(storage_path),
                    "file_size": file_size,
                },
            )

            self.db.commit()
            self.db.refresh(document)
        except Exception:
            self.db.rollback()
            storage_path.unlink(missing_ok=True)
            raise

        logger.info(
            "upload_completed | document_id=%s filename=%s file_size=%s user_id=%s",
            document.id,
            document.original_filename,
            file_size,
            user_id,
        )

        return document

    def list_my_documents(self, user_id: str):
        return self.document_repo.list_by_user_id(user_id)

    def get_my_document(
        self,
        *,
        user_id: str,
        document_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> UploadedDocument:
        document = self.document_repo.get_by_id_and_user_id(document_id, user_id)
        if not document:
            raise NotFoundAppException("Document not found")

        file_path = Path(document.storage_key)
        if not file_path.exists():
            raise NotFoundAppException("Document file not found")

        normalized_ip = self._normalize_ip(ip_address)

        self.audit_service.log_action(
            actor_type=LogActorType.user,
            actor_user_id=user_id,
            action="document_downloaded",
            resource_type="uploaded_document",
            resource_id=document.id,
            ip_address=normalized_ip,
            user_agent=user_agent,
            metadata={"storage_key": document.storage_key},
        )
        self.db.commit()

        return document