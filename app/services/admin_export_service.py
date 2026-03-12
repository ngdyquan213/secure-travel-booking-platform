from __future__ import annotations

from app.repositories.admin_repository import AdminRepository
from app.utils.csv_utils import build_csv_bytes


class AdminExportService:
    def __init__(self, admin_repo: AdminRepository) -> None:
        self.admin_repo = admin_repo

    def export_bookings_csv(
        self,
        *,
        status: str | None = None,
        payment_status: str | None = None,
        booking_code: str | None = None,
        sort_by: str = "booked_at",
        sort_order: str = "desc",
    ) -> bytes:
        bookings = self.admin_repo.list_bookings(
            skip=0,
            limit=10000,
            status=status,
            payment_status=payment_status,
            booking_code=booking_code,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        headers = [
            "id",
            "booking_code",
            "user_id",
            "status",
            "total_final_amount",
            "currency",
            "payment_status",
            "booked_at",
            "cancelled_at",
        ]
        rows = [
            [
                str(b.id),
                b.booking_code,
                str(b.user_id),
                b.status.value if hasattr(b.status, "value") else str(b.status),
                str(b.total_final_amount),
                b.currency,
                b.payment_status.value if hasattr(b.payment_status, "value") else str(b.payment_status),
                b.booked_at.isoformat() if b.booked_at else "",
                b.cancelled_at.isoformat() if getattr(b, "cancelled_at", None) else "",
            ]
            for b in bookings
        ]
        return build_csv_bytes(headers, rows)

    def export_refunds_csv(
        self,
        *,
        status: str | None = None,
        payment_id: str | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> bytes:
        refunds = self.admin_repo.list_refunds(
            skip=0,
            limit=10000,
            status=status,
            payment_id=payment_id,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        headers = [
            "id",
            "payment_id",
            "amount",
            "currency",
            "status",
            "reason",
            "processed_at",
            "created_at",
        ]
        rows = [
            [
                str(r.id),
                str(r.payment_id),
                str(r.amount),
                r.currency,
                r.status.value if hasattr(r.status, "value") else str(r.status),
                r.reason or "",
                r.processed_at.isoformat() if r.processed_at else "",
                r.created_at.isoformat() if r.created_at else "",
            ]
            for r in refunds
        ]
        return build_csv_bytes(headers, rows)

    def export_audit_logs_csv(self) -> bytes:
        logs = self.admin_repo.list_audit_logs(skip=0, limit=10000)

        headers = [
            "id",
            "actor_type",
            "actor_user_id",
            "action",
            "resource_type",
            "resource_id",
            "ip_address",
            "user_agent",
            "created_at",
        ]
        rows = [
            [
                str(log.id),
                log.actor_type.value if hasattr(log.actor_type, "value") else str(log.actor_type),
                str(log.actor_user_id) if log.actor_user_id else "",
                log.action,
                log.resource_type or "",
                str(log.resource_id) if log.resource_id else "",
                log.ip_address or "",
                log.user_agent or "",
                log.created_at.isoformat() if log.created_at else "",
            ]
            for log in logs
        ]
        return build_csv_bytes(headers, rows)