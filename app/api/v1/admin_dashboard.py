from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_dashboard_repository import AdminDashboardRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.admin_dashboard import (
    AdminDashboardSummaryResponse,
    BookingStatusCountItem,
    PaymentStatusCountItem,
    RecentActivityItem,
    RefundStatusCountItem,
    RevenueSummaryResponse,
)
from app.services.admin_dashboard_service import AdminDashboardService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/admin", tags=["admin-dashboard"])


@router.get("/dashboard/summary", response_model=AdminDashboardSummaryResponse)
def get_admin_dashboard_summary(
    request: Request,
    recent_limit: int = Query(default=10, ge=1, le=50),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminDashboardSummaryResponse:
    dashboard_service = AdminDashboardService(AdminDashboardRepository(db))
    audit_service = AuditService(AuditRepository(db))

    summary = dashboard_service.get_dashboard_summary(recent_limit=recent_limit)

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_view_dashboard_summary",
        resource_type="dashboard",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"recent_limit": recent_limit},
    )
    db.commit()

    return AdminDashboardSummaryResponse(
        booking_status_counts=[
            BookingStatusCountItem(**item)
            for item in summary["booking_status_counts"]
        ],
        payment_status_counts=[
            PaymentStatusCountItem(**item)
            for item in summary["payment_status_counts"]
        ],
        refund_status_counts=[
            RefundStatusCountItem(**item)
            for item in summary["refund_status_counts"]
        ],
        revenue=RevenueSummaryResponse(**summary["revenue"]),
        recent_activities=[
            RecentActivityItem(
                audit_log_id=str(log.id),
                actor_type=log.actor_type.value if hasattr(log.actor_type, "value") else str(log.actor_type),
                actor_user_id=str(log.actor_user_id) if log.actor_user_id else None,
                action=log.action,
                resource_type=log.resource_type,
                resource_id=str(log.resource_id) if log.resource_id else None,
                created_at=log.created_at,
            )
            for log in summary["recent_activities"]
        ],
    )