from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictAppException, NotFoundAppException
from app.models.enums import BookingStatus, LogActorType
from app.repositories.booking_repository import BookingRepository
from app.repositories.flight_repository import FlightRepository
from app.repositories.hotel_repository import HotelRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.booking import BookingCancelRequest
from app.services.audit_service import AuditService
from app.services.booking_inventory_service import BookingInventoryService
from app.services.booking_refund_service import BookingRefundService
from app.utils.enums import enum_to_str
from app.workers.email_worker import EmailWorker


class BookingCancellationService:
    def __init__(
        self,
        db: Session,
        booking_repo: BookingRepository,
        payment_repo: PaymentRepository,
        flight_repo: FlightRepository,
        hotel_repo: HotelRepository,
        tour_repo: TourRepository,
        audit_service: AuditService,
        email_worker: EmailWorker | None = None,
        inventory_service: BookingInventoryService | None = None,
        refund_service: BookingRefundService | None = None,
    ) -> None:
        self.db = db
        self.booking_repo = booking_repo
        self.payment_repo = payment_repo
        self.audit_service = audit_service
        self.email_worker = email_worker or EmailWorker()
        self.inventory_service = inventory_service or BookingInventoryService(
            flight_repo=flight_repo,
            hotel_repo=hotel_repo,
            tour_repo=tour_repo,
        )
        self.refund_service = refund_service or BookingRefundService(payment_repo)

    def _assert_booking_can_be_cancelled(self, current_status: str) -> None:
        if current_status == BookingStatus.cancelled.value:
            raise ConflictAppException("Booking already cancelled")

        disallowed = set()
        if current_status in disallowed:
            raise ConflictAppException(f"Booking cannot be cancelled from status: {current_status}")

    def cancel_booking(
        self,
        *,
        booking_id: str,
        user_id: str,
        payload: BookingCancelRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        booking_status = enum_to_str(booking.status)
        self._assert_booking_can_be_cancelled(booking_status)

        payment = self.payment_repo.get_latest_by_booking_id(str(booking.id))
        refund = None
        refund_amount = 0

        with self.db.begin_nested():
            self.inventory_service.restore_inventory(booking)

            booking.status = BookingStatus.cancelled
            booking.cancelled_at = datetime.now(timezone.utc)
            booking.cancellation_reason = payload.reason
            self.booking_repo.save(booking)

            payment, refund, refund_amount = (
                self.refund_service.process_cancellation_payment_effects(
                    booking=booking,
                    payment=payment,
                    reason=payload.reason,
                )
            )
            self.booking_repo.save(booking)

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="booking_cancelled",
                resource_type="booking",
                resource_id=booking.id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "booking_code": booking.booking_code,
                    "refund_amount": str(refund_amount),
                    "reason": payload.reason,
                },
            )

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        self.db.refresh(booking)
        if payment:
            self.db.refresh(payment)
        if refund:
            self.db.refresh(refund)

        if booking.user:
            self.email_worker.send_booking_cancelled_email(
                to_email=booking.user.email,
                full_name=booking.user.full_name,
                booking_code=booking.booking_code,
                cancellation_reason=booking.cancellation_reason,
            )

            if refund and refund.amount > 0:
                self.email_worker.send_refund_processed_email(
                    to_email=booking.user.email,
                    full_name=booking.user.full_name,
                    booking_code=booking.booking_code,
                    refund_amount=str(refund.amount),
                    currency=refund.currency,
                )

        return booking, payment, refund
