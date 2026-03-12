from __future__ import annotations

from datetime import datetime, timezone

from app.core.exceptions import ConflictAppException, NotFoundAppException, ValidationAppException
from app.models.enums import RefundStatus
from app.repositories.admin_repository import AdminRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.user_repository import UserRepository
from app.services.audit_service import AuditService


class AdminService:
    def __init__(
        self,
        user_repo: UserRepository,
        admin_repo: AdminRepository,
        payment_repo: PaymentRepository | None = None,
        audit_service: AuditService | None = None,
    ) -> None:
        self.user_repo = user_repo
        self.admin_repo = admin_repo
        self.payment_repo = payment_repo
        self.audit_service = audit_service

    def list_users(self, skip: int = 0, limit: int = 50):
        return self.user_repo.list_users(skip=skip, limit=limit)

    def list_bookings(self, skip: int = 0, limit: int = 50):
        return self.admin_repo.list_bookings(skip=skip, limit=limit)

    def list_cancelled_bookings(self, skip: int = 0, limit: int = 50):
        return self.admin_repo.list_cancelled_bookings(skip=skip, limit=limit)

    def list_payments(self, skip: int = 0, limit: int = 50):
        return self.admin_repo.list_payments(skip=skip, limit=limit)

    def list_refunds(self, skip: int = 0, limit: int = 50):
        return self.admin_repo.list_refunds(skip=skip, limit=limit)

    def list_audit_logs(self, skip: int = 0, limit: int = 50):
        return self.admin_repo.list_audit_logs(skip=skip, limit=limit)

    def _assert_refund_transition_allowed(self, current_status: str, new_status: str) -> None:
        allowed_transitions = {
            RefundStatus.pending.value: {
                RefundStatus.processed.value,
                RefundStatus.failed.value,
                RefundStatus.cancelled.value,
            },
            RefundStatus.failed.value: {
                RefundStatus.processed.value,
                RefundStatus.cancelled.value,
            },
            RefundStatus.processed.value: set(),
            RefundStatus.cancelled.value: set(),
        }

        if new_status == current_status:
            raise ConflictAppException(f"Refund is already in status: {current_status}")

        if new_status not in allowed_transitions.get(current_status, set()):
            raise ConflictAppException(
                f"Refund transition is not allowed from {current_status} to {new_status}"
            )

    def update_refund_status(
        self,
        *,
        refund_id: str,
        new_status: str,
        reason: str | None = None,
    ):
        if not self.payment_repo:
            raise ValidationAppException("Payment repository is required")

        refund = self.payment_repo.get_refund_by_id(refund_id)
        if not refund:
            raise NotFoundAppException("Refund not found")

        try:
            target_status = RefundStatus(new_status)
        except ValueError as exc:
            raise ValidationAppException("Invalid refund status") from exc

        current_status = refund.status.value if hasattr(refund.status, "value") else str(refund.status)
        self._assert_refund_transition_allowed(current_status, target_status.value)

        refund.status = target_status

        if refund.status == RefundStatus.processed:
            refund.processed_at = datetime.now(timezone.utc)

        if reason is not None:
            refund.reason = reason

        self.payment_repo.save_refund(refund)
        return refund
    
def list_bookings(
        self,
        skip: int = 0,
        limit: int = 50,
        status: str | None = None,
        payment_status: str | None = None,
        booking_code: str | None = None,
        sort_by: str = "booked_at",
        sort_order: str = "desc",
    ):
        return self.admin_repo.list_bookings(
            skip=skip,
            limit=limit,
            status=status,
            payment_status=payment_status,
            booking_code=booking_code,
            sort_by=sort_by,
            sort_order=sort_order,
        )

def list_refunds(
        self,
        skip: int = 0,
        limit: int = 50,
        status: str | None = None,
        payment_id: str | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ):
        return self.admin_repo.list_refunds(
            skip=skip,
            limit=limit,
            status=status,
            payment_id=payment_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )