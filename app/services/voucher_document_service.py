from __future__ import annotations

from pathlib import Path

from app.models.document import UploadedDocument
from app.models.enums import DocumentType, LogActorType
from app.repositories.document_repository import DocumentRepository
from app.services.audit_service import AuditService
from app.services.pdf_voucher_service import PDFVoucherService
from app.utils.file_utils import generate_stored_filename
from app.workers.email_worker import EmailWorker


class VoucherDocumentService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        audit_service: AuditService,
        pdf_voucher_service: PDFVoucherService | None = None,
        email_worker: EmailWorker | None = None,
    ) -> None:
        self.document_repo = document_repo
        self.audit_service = audit_service
        self.pdf_voucher_service = pdf_voucher_service or PDFVoucherService()
        self.email_worker = email_worker or EmailWorker()

    def export_pdf(self, *, booking, ip_address: str | None = None, user_agent: str | None = None) -> tuple[bytes, str]:
        self.audit_service.log_action(
            actor_type=LogActorType.user,
            actor_user_id=booking.user_id,
            action="booking_voucher_pdf_exported",
            resource_type="booking",
            resource_id=booking.id,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata={"booking_code": booking.booking_code},
        )

        pdf_bytes = self.pdf_voucher_service.generate_pdf_bytes(booking)
        filename = f"{booking.booking_code}.pdf"
        return pdf_bytes, filename

    def generate_and_store(
        self,
        *,
        booking,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> UploadedDocument:
        upload_dir = Path("uploads")
        upload_dir.mkdir(parents=True, exist_ok=True)

        pdf_bytes = self.pdf_voucher_service.generate_pdf_bytes(booking)
        original_filename = f"{booking.booking_code}.pdf"
        stored_filename = generate_stored_filename(original_filename)
        storage_path = upload_dir / stored_filename

        with open(storage_path, "wb") as f:
            f.write(pdf_bytes)

        document = UploadedDocument(
            user_id=booking.user_id,
            booking_id=booking.id,
            traveler_id=None,
            document_type=DocumentType.voucher,
            original_filename=original_filename,
            stored_filename=stored_filename,
            mime_type="application/pdf",
            file_size=len(pdf_bytes),
            storage_bucket="local",
            storage_key=str(storage_path),
            is_private=True,
        )
        self.document_repo.add_document(document)

        self.audit_service.log_action(
            actor_type=LogActorType.user,
            actor_user_id=booking.user_id,
            action="booking_voucher_generated",
            resource_type="uploaded_document",
            resource_id=document.id,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata={
                "booking_id": str(booking.id),
                "booking_code": booking.booking_code,
                "document_type": "voucher",
                "storage_key": str(storage_path),
            },
        )

        if booking.user:
            self.email_worker.send_voucher_generated_email(
                to_email=booking.user.email,
                full_name=booking.user.full_name,
                booking_code=booking.booking_code,
                voucher_filename=original_filename,
            )

        return document