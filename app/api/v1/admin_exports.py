from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.error import ErrorResponse
from app.services.admin_export_service import AdminExportService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/admin", tags=["admin-exports"])


@router.get("/bookings/export.csv")
def export_bookings_csv(
    request: Request,
    status: str | None = Query(default=None),
    payment_status: str | None = Query(default=None),
    booking_code: str | None = Query(default=None),
    sort_by: str = Query(default="booked_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    export_service = AdminExportService(admin_repo)
    audit_service = AuditService(AuditRepository(db))

    csv_bytes = export_service.export_bookings_csv(
        status=status,
        payment_status=payment_status,
        booking_code=booking_code,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_export_bookings_csv",
        resource_type="booking",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "status": status,
            "payment_status": payment_status,
            "booking_code": booking_code,
            "sort_by": sort_by,
            "sort_order": sort_order,
        },
    )
    db.commit()

    filename = f"bookings_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/refunds/export.csv")
def export_refunds_csv(
    request: Request,
    status: str | None = Query(default=None),
    payment_id: str | None = Query(default=None),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    export_service = AdminExportService(admin_repo)
    audit_service = AuditService(AuditRepository(db))

    csv_bytes = export_service.export_refunds_csv(
        status=status,
        payment_id=payment_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_export_refunds_csv",
        resource_type="refund",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "status": status,
            "payment_id": payment_id,
            "sort_by": sort_by,
            "sort_order": sort_order,
        },
    )
    db.commit()

    filename = f"refunds_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/audit-logs/export.csv")
def export_audit_logs_csv(
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    export_service = AdminExportService(admin_repo)
    audit_service = AuditService(AuditRepository(db))

    csv_bytes = export_service.export_audit_logs_csv()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_export_audit_logs_csv",
        resource_type="audit_log",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={},
    )
    db.commit()

    filename = f"audit_logs_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )