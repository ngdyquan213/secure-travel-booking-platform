from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictAppException, NotFoundAppException, ValidationAppException
from app.models.enums import LogActorType, PaymentMethod, PaymentStatus
from app.models.payment import Payment
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.services.audit_service import AuditService
from app.utils.enums import enum_to_str
from app.utils.ip_utils import normalize_ip
from app.workers.email_worker import EmailWorker

PAYMENT_IDEMPOTENCY_CONSTRAINT = "uq_payments_booking_id_idempotency_key"
PAYMENT_GATEWAY_ORDER_REF_CONSTRAINT = "uq_payments_gateway_order_ref"


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
        payment_method: PaymentMethod,
        idempotency_key: str | None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Payment:
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise ValidationAppException("Booking not found")

        if not idempotency_key:
            raise ValidationAppException("Idempotency key is required")

        existing = self.payment_repo.get_by_booking_and_idempotency_key(
            booking_id=booking_id,
            idempotency_key=idempotency_key,
        )
        if existing:
            return existing

        booking_payment_status = enum_to_str(booking.payment_status)
        if booking_payment_status == PaymentStatus.paid.value:
            raise ConflictAppException("Booking is already paid")

        amount = Decimal(booking.total_final_amount)
        if amount <= Decimal("0.00"):
            raise ValidationAppException("Invalid payment amount")

        gateway_order_ref = f"PAY-{booking.booking_code}-{idempotency_key}"
        normalized_ip = normalize_ip(ip_address)

        try:
            payment = Payment(
                booking_id=booking.id,
                initiated_by=booking.user_id,
                payment_method=payment_method,
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
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={
                    "booking_id": str(booking.id),
                    "booking_code": booking.booking_code,
                    "amount": str(payment.amount),
                    "currency": payment.currency,
                    "payment_method": payment_method.value,
                    "gateway_order_ref": gateway_order_ref,
                },
            )
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()

            if PAYMENT_IDEMPOTENCY_CONSTRAINT not in str(
                exc.orig
            ) and PAYMENT_GATEWAY_ORDER_REF_CONSTRAINT not in str(exc.orig):
                raise

            existing = self.payment_repo.get_by_booking_and_idempotency_key(
                booking_id=booking_id,
                idempotency_key=idempotency_key,
            )
            if existing is None:
                raise

            payment = existing
        except Exception:
            self.db.rollback()
            raise

        self.db.refresh(payment)
        return payment

    def simulate_success(
        self,
        *,
        payment_id: str,
        user_id: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Payment:
        payment = self.payment_repo.get_by_id(payment_id)
        if not payment:
            raise NotFoundAppException("Payment not found")

        booking = self.booking_repo.get_by_id_and_user_id(str(payment.booking_id), user_id)
        if not booking:
            raise ValidationAppException("Booking not found")

        payment.status = PaymentStatus.paid
        payment.gateway_transaction_ref = (
            payment.gateway_transaction_ref or f"SIM-{uuid4().hex[:12].upper()}"
        )
        payment.paid_at = datetime.now(timezone.utc)
        booking.payment_status = PaymentStatus.paid

        normalized_ip = normalize_ip(ip_address)

        try:
            self.payment_repo.save(payment)
            self.booking_repo.save(booking)
            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="payment_simulated_success",
                resource_type="payment",
                resource_id=payment.id,
                ip_address=normalized_ip,
                user_agent=user_agent,
                metadata={"booking_id": str(booking.id)},
            )
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

        self.db.refresh(payment)
        return payment
