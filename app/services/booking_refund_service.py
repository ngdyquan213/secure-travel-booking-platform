from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from app.models.enums import PaymentStatus, RefundStatus
from app.models.refund import Refund
from app.repositories.payment_repository import PaymentRepository


class BookingRefundService:
    def __init__(self, payment_repo: PaymentRepository) -> None:
        self.payment_repo = payment_repo

    def calculate_refund_amount(self, booking, payment) -> Decimal:
        if not payment:
            return Decimal("0.00")

        payment_status = payment.status.value if hasattr(payment.status, "value") else str(payment.status)
        if payment_status != PaymentStatus.paid.value:
            return Decimal("0.00")

        return Decimal(booking.total_final_amount)

    def process_cancellation_payment_effects(self, *, booking, payment, reason: str | None):
        refund = None
        refund_amount = Decimal("0.00")

        if not payment:
            return payment, refund, refund_amount

        refund_amount = self.calculate_refund_amount(booking, payment)
        payment_status = payment.status.value if hasattr(payment.status, "value") else str(payment.status)

        if payment_status == PaymentStatus.paid.value:
            refund = Refund(
                payment_id=payment.id,
                amount=refund_amount,
                currency=payment.currency,
                status=RefundStatus.processed,
                reason=reason or "User cancelled booking",
                processed_at=datetime.now(timezone.utc),
            )
            self.payment_repo.add_refund(refund)
            payment.status = PaymentStatus.refunded
            self.payment_repo.save(payment)
            booking.payment_status = PaymentStatus.refunded

        elif payment_status in {PaymentStatus.pending.value, PaymentStatus.authorized.value}:
            payment.status = PaymentStatus.cancelled
            self.payment_repo.save(payment)
            booking.payment_status = PaymentStatus.cancelled

        return payment, refund, refund_amount