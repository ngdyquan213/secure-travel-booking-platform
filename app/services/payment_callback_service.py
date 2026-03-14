from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.constants import ALLOWED_PAYMENT_CALLBACK_STATUSES
from app.core.exceptions import ConflictAppException, NotFoundAppException, ValidationAppException
from app.core.security import verify_payment_callback_signature
from app.models.enums import LogActorType, PaymentStatus, SecurityEventType
from app.models.payment import PaymentCallback
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.services.audit_service import AuditService
from app.utils.enums import enum_to_str
from app.utils.ip_utils import normalize_ip
from app.workers.email_worker import EmailWorker

PAYMENT_CALLBACK_REPLAY_CONSTRAINT = "uq_payment_callbacks_gateway_name_transaction_ref"


class PaymentCallbackService:
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

    def _normalize_callback_status(self, status: str) -> str:
        normalized_status = status.lower()
        if normalized_status not in ALLOWED_PAYMENT_CALLBACK_STATUSES:
            raise ValidationAppException("Unsupported payment callback status")
        return normalized_status

    def _assert_transition_allowed(self, current_status: str, incoming_status: str) -> None:
        terminal_statuses = {
            PaymentStatus.paid.value,
            PaymentStatus.failed.value,
            PaymentStatus.cancelled.value,
            PaymentStatus.refunded.value,
        }

        if current_status == PaymentStatus.refunded.value:
            raise ConflictAppException("Payment is already refunded")

        if (
            current_status == PaymentStatus.paid.value
            and incoming_status == PaymentStatus.paid.value
        ):
            raise ConflictAppException("Payment is already marked as paid")

        if current_status in terminal_statuses and current_status != incoming_status:
            raise ConflictAppException(
                f"Payment transition is not allowed from {current_status} to {incoming_status}"
            )

    def process_callback(
        self,
        *,
        gateway_name: str,
        gateway_order_ref: str,
        gateway_transaction_ref: str,
        amount: str,
        currency: str,
        status: str,
        signature: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        signature_ok = verify_payment_callback_signature(
            gateway_name=gateway_name,
            gateway_order_ref=gateway_order_ref,
            gateway_transaction_ref=gateway_transaction_ref,
            amount=amount,
            currency=currency,
            status=status,
            signature=signature,
        )
        if not signature_ok:
            self.audit_service.log_security_event(
                event_type=SecurityEventType.payment,
                severity="critical",
                title="Invalid payment callback signature",
                description="Payment callback signature verification failed",
                ip_address=ip_address,
                event_data={
                    "gateway_name": gateway_name,
                    "gateway_order_ref": gateway_order_ref,
                    "gateway_transaction_ref": gateway_transaction_ref,
                },
            )
            self.db.commit()
            raise ValidationAppException("Invalid callback signature")

        existing_callback = self.payment_repo.get_callback_by_gateway_txn_ref(
            gateway_name=gateway_name,
            gateway_transaction_ref=gateway_transaction_ref,
        )
        if existing_callback:
            self.audit_service.log_security_event(
                event_type=SecurityEventType.payment,
                severity="medium",
                title="Replay payment callback detected",
                description="Duplicate payment callback transaction reference detected",
                ip_address=ip_address,
                event_data={
                    "gateway_name": gateway_name,
                    "gateway_order_ref": gateway_order_ref,
                    "gateway_transaction_ref": gateway_transaction_ref,
                },
            )
            self.db.commit()
            raise ValidationAppException("Replay callback detected")

        payment = self.payment_repo.get_by_gateway_order_ref_for_update(gateway_order_ref)
        if not payment:
            raise NotFoundAppException("Payment not found")

        expected_amount = Decimal(payment.amount)
        actual_amount = Decimal(amount)
        if actual_amount != expected_amount:
            self.audit_service.log_security_event(
                event_type=SecurityEventType.payment,
                severity="critical",
                title="Payment callback amount mismatch",
                description="Payment callback amount does not match expected amount",
                ip_address=ip_address,
                event_data={
                    "gateway_order_ref": gateway_order_ref,
                    "expected_amount": str(expected_amount),
                    "actual_amount": str(actual_amount),
                },
            )
            self.db.commit()
            raise ValidationAppException("Payment amount mismatch")

        expected_currency = payment.currency.upper()
        actual_currency = currency.upper()
        if actual_currency != expected_currency:
            self.audit_service.log_security_event(
                event_type=SecurityEventType.payment,
                severity="critical",
                title="Payment callback currency mismatch",
                description="Payment callback currency does not match expected currency",
                ip_address=ip_address,
                event_data={
                    "gateway_order_ref": gateway_order_ref,
                    "expected_currency": expected_currency,
                    "actual_currency": actual_currency,
                },
            )
            self.db.commit()
            raise ValidationAppException("Payment currency mismatch")

        booking = self.booking_repo.get_by_id(str(payment.booking_id))
        if not booking:
            raise NotFoundAppException("Booking not found")

        normalized_status = self._normalize_callback_status(status)
        current_status = enum_to_str(payment.status)
        self._assert_transition_allowed(current_status, normalized_status)

        try:
            with self.db.begin_nested():
                callback = PaymentCallback(
                    payment_id=payment.id,
                    gateway_name=gateway_name,
                    gateway_transaction_ref=gateway_transaction_ref,
                    callback_payload={
                        "gateway_name": gateway_name,
                        "gateway_order_ref": gateway_order_ref,
                        "gateway_transaction_ref": gateway_transaction_ref,
                        "amount": amount,
                        "currency": currency,
                        "status": status,
                    },
                    signature_valid=True,
                    processed=True,
                    source_ip=normalize_ip(ip_address),
                    received_at=datetime.now(timezone.utc),
                )
                self.payment_repo.add_callback(callback)

                if normalized_status == PaymentStatus.paid.value:
                    payment.status = PaymentStatus.paid
                    payment.gateway_transaction_ref = gateway_transaction_ref
                    payment.paid_at = datetime.now(timezone.utc)
                    booking.payment_status = PaymentStatus.paid

                elif normalized_status == PaymentStatus.failed.value:
                    payment.status = PaymentStatus.failed
                    payment.gateway_transaction_ref = gateway_transaction_ref
                    booking.payment_status = PaymentStatus.failed

                elif normalized_status == PaymentStatus.cancelled.value:
                    payment.status = PaymentStatus.cancelled
                    payment.gateway_transaction_ref = gateway_transaction_ref
                    booking.payment_status = PaymentStatus.cancelled

                self.payment_repo.save(payment)
                self.booking_repo.save(booking)

                self.audit_service.log_action(
                    actor_type=LogActorType.system,
                    action="payment_callback_processed",
                    resource_type="payment",
                    resource_id=payment.id,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    metadata={
                        "gateway_name": gateway_name,
                        "gateway_order_ref": gateway_order_ref,
                        "gateway_transaction_ref": gateway_transaction_ref,
                        "status": normalized_status,
                    },
                )
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()

            if PAYMENT_CALLBACK_REPLAY_CONSTRAINT not in str(exc.orig):
                raise

            self.audit_service.log_security_event(
                event_type=SecurityEventType.payment,
                severity="medium",
                title="Replay payment callback detected",
                description="Duplicate payment callback transaction reference detected",
                ip_address=ip_address,
                event_data={
                    "gateway_name": gateway_name,
                    "gateway_order_ref": gateway_order_ref,
                    "gateway_transaction_ref": gateway_transaction_ref,
                },
            )
            self.db.commit()
            raise ValidationAppException("Replay callback detected") from exc
        except Exception:
            self.db.rollback()
            raise

        self.db.refresh(payment)
        self.db.refresh(booking)

        if normalized_status == PaymentStatus.paid.value and booking.user:
            self.email_worker.send_payment_success_email(
                to_email=booking.user.email,
                full_name=booking.user.full_name,
                booking_code=booking.booking_code,
                gateway_transaction_ref=payment.gateway_transaction_ref,
            )

        return payment, booking
