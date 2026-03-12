from __future__ import annotations

from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictAppException, NotFoundAppException, ValidationAppException
from app.models.enums import LogActorType, PaymentMethod, PaymentStatus
from app.models.payment import Payment
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.services.audit_service import AuditService
from app.workers.email_worker import EmailWorker


class PaymentService:
    def __init__(
        self,
        db: Session,
        booking_repo: BookingRepository,
        payment_repo: PaymentRepository,
        audit_service: AuditService,
        email_worker: EmailWorker | None = None,
    ) -> None:
        self.db = db
        self.booking_repo = booking_repo
        self.payment_repo = payment_repo
        self.audit_service = audit_service
        self.email_worker = email_worker or EmailWorker()

    def initiate_payment(
        self,
        *,
        booking_id: str,
        user_id: str,
        payment_method: str,
        idempotency_key: str | None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Payment:
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        if not idempotency_key:
            raise ValidationAppException("Idempotency key is required")

        try:
            payment_method_enum = PaymentMethod(payment_method)
        except ValueError as exc:
            raise ValidationAppException("Unsupported payment method") from exc

        existing = self.payment_repo.get_by_booking_and_idempotency_key(
            booking_id=booking_id,
            idempotency_key=idempotency_key,
        )
        if existing:
            return existing

        booking_payment_status = booking.payment_status.value if hasattr(booking.payment_status, "value") else str(booking.payment_status)
        if booking_payment_status == PaymentStatus.paid.value:
            raise ConflictAppException("Booking is already paid")

        amount = Decimal(booking.total_final_amount)
        if amount <= Decimal("0.00"):
            raise ValidationAppException("Invalid payment amount")

        gateway_order_ref = f"PAY-{booking.booking_code}-{idempotency_key}"

        with self.db.begin():
            payment = Payment(
                booking_id=booking.id,
                initiated_by=booking.user_id,
                payment_method=payment_method_enum,
                status=PaymentStatus.pending,
                amount=amount,
                currency=booking.currency,
                gateway_order_ref=gateway_order_ref,
                gateway_transaction_ref=None,
                idempotency_key=idempotency_key,
                paid_at=None,
            )
            self.payment_repo.add_payment(payment)

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="payment_initiated",
                resource_type="payment",
                resource_id=payment.id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "booking_id": str(booking.id),
                    "booking_code": booking.booking_code,
                    "amount": str(payment.amount),
                    "currency": payment.currency,
                    "payment_method": payment_method_enum.value,
                    "gateway_order_ref": gateway_order_ref,
                },
            )

        self.db.refresh(payment)
        return payment