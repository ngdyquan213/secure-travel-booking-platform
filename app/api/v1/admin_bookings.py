from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin import AdminBookingResponse
from app.schemas.common import PaginatedResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response
from app.utils.response_mappers import admin_booking_to_dict

router = APIRouter(prefix="/admin", tags=["admin-bookings"])


@router.get("/bookings", response_model=PaginatedResponse)
def list_bookings(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    status: str | None = Query(default=None),
    payment_status: str | None = Query(default=None),
    booking_code: str | None = Query(default=None),
    sort_by: str = Query(default="booked_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    bookings = service.list_bookings(
        skip=pagination.offset,
        limit=pagination.limit,
        status=status,
        payment_status=payment_status,
        booking_code=booking_code,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total = admin_repo.count_bookings(
        status=status,
        payment_status=payment_status,
        booking_code=booking_code,
    )

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_bookings",
        resource_type="booking",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "status": status,
            "payment_status": payment_status,
            "booking_code": booking_code,
            "sort_by": sort_by,
            "sort_order": sort_order,
            "result_count": len(bookings),
        },
    )
    db.commit()

    items = [admin_booking_to_dict(b) for b in bookings]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )