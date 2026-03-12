from __future__ import annotations

from app.core.exceptions import NotFoundAppException
from app.models.enums import LogActorType
from app.repositories.booking_repository import BookingRepository
from app.repositories.document_repository import DocumentRepository
from app.services.audit_service import AuditService
from app.services.pdf_voucher_service import PDFVoucherService
from app.services.voucher_document_service import VoucherDocumentService
from app.services.voucher_render_service import VoucherRenderService
from app.workers.email_worker import EmailWorker


class VoucherService:
    def __init__(
        self,
        booking_repo: BookingRepository,
        audit_service: AuditService,
        document_repo: DocumentRepository,
        pdf_voucher_service: PDFVoucherService | None = None,
        email_worker: EmailWorker | None = None,
        voucher_render_service: VoucherRenderService | None = None,
        voucher_document_service: VoucherDocumentService | None = None,
    ) -> None:
        self.booking_repo = booking_repo
        self.audit_service = audit_service
        self.document_repo = document_repo
        self.pdf_voucher_service = pdf_voucher_service or PDFVoucherService()
        self.email_worker = email_worker or EmailWorker()
        self.voucher_render_service = voucher_render_service or VoucherRenderService()
        self.voucher_document_service = voucher_document_service or VoucherDocumentService(
            document_repo=document_repo,
            audit_service=audit_service,
            pdf_voucher_service=self.pdf_voucher_service,
            email_worker=self.email_worker,
        )

    def _resolve_voucher_type(self, booking) -> str:
        return self.voucher_render_service.resolve_voucher_type(booking)

    def _build_item_title_and_description(self, item) -> tuple[str | None, str, str | None]:
        return self.voucher_render_service.build_item_title_and_description(item)

    def get_my_booking_voucher(
        self,
        *,
        booking_id: str,
        user_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        self.audit_service.log_action(
            actor_type=LogActorType.user,
            actor_user_id=booking.user_id,
            action="booking_voucher_viewed",
            resource_type="booking",
            resource_id=booking.id,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata={"booking_code": booking.booking_code},
        )
        return booking

    def export_my_booking_voucher_pdf(
        self,
        *,
        booking_id: str,
        user_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[bytes, str]:
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        return self.voucher_document_service.export_pdf(
            booking=booking,
            ip_address=ip_address,
            user_agent=user_agent,
        )

    def generate_and_store_my_booking_voucher(
        self,
        *,
        booking_id: str,
        user_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        return self.voucher_document_service.generate_and_store(
            booking=booking,
            ip_address=ip_address,
            user_agent=user_agent,
        )