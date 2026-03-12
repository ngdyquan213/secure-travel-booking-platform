from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin_refund import AdminRefundResponse, AdminRefundUpdateRequest
from app.schemas.common import PaginatedResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

from app.repositories.coupon_repository import CouponRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.admin_bulk import (
    BulkActionItemResult,
    BulkActionResponse,
    BulkRefundUpdateRequest,
)
from app.services.admin_bulk_service import AdminBulkService
from app.utils.response_mappers import admin_refund_to_dict

router = APIRouter(prefix="/admin", tags=["admin-refunds"])


@router.get("/refunds", response_model=PaginatedResponse)
def list_refunds(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    status: str | None = Query(default=None),
    payment_id: str | None = Query(default=None),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    audit_service = AuditService(AuditRepository(db))
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )

    refunds = service.list_refunds(
        skip=pagination.offset,
        limit=pagination.limit,
        status=status,
        payment_id=payment_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total = admin_repo.count_refunds(
        status=status,
        payment_id=payment_id,
    )

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_refunds",
        resource_type="refund",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "status": status,
            "payment_id": payment_id,
            "sort_by": sort_by,
            "sort_order": sort_order,
            "result_count": len(refunds),
        },
    )
    db.commit()

    items = [admin_refund_to_dict(r) for r in refunds]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.put("/refunds/{refund_id}", response_model=AdminRefundResponse)
def update_refund_status(
    refund_id: str,
    payload: AdminRefundUpdateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminRefundResponse:
    audit_service = AuditService(AuditRepository(db))
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=AdminRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=audit_service,
    )

    with db.begin():
        refund = service.update_refund_status(
            refund_id=refund_id,
            new_status=payload.status,
            reason=payload.reason,
        )

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_update_refund_status",
            resource_type="refund",
            resource_id=refund.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={
                "new_status": payload.status,
                "reason": payload.reason,
            },
        )

    db.refresh(refund)

    return AdminRefundResponse(**admin_refund_to_dict(refund))


@router.post("/refunds/bulk-update", response_model=BulkActionResponse)
def bulk_update_refunds(
    payload: BulkRefundUpdateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> BulkActionResponse:
    audit_service = AuditService(AuditRepository(db))
    admin_service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=AdminRepository(db),
        payment_repo=PaymentRepository(db),
        audit_service=audit_service,
    )
    bulk_service = AdminBulkService(
        coupon_repo=CouponRepository(db),
        tour_repo=TourRepository(db),
        payment_repo=PaymentRepository(db),
        admin_service=admin_service,
    )

    with db.begin():
        raw_results = bulk_service.bulk_update_refunds(
            refund_ids=payload.refund_ids,
            status=payload.status,
            reason=payload.reason,
        )

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_bulk_update_refunds",
            resource_type="refund",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={
                "requested_ids": payload.refund_ids,
                "target_status": payload.status,
                "success_count": sum(1 for r in raw_results if r["success"]),
                "failed_count": sum(1 for r in raw_results if not r["success"]),
            },
        )

    results = [BulkActionItemResult(**item) for item in raw_results]
    return BulkActionResponse(
        total_requested=len(payload.refund_ids),
        success_count=sum(1 for r in raw_results if r["success"]),
        failed_count=sum(1 for r in raw_results if not r["success"]),
        results=results,
    )