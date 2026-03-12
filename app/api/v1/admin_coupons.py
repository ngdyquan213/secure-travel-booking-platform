from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.coupon import Coupon
from app.models.enums import CouponApplicableProductType, CouponType, LogActorType
from app.repositories.audit_repository import AuditRepository
from app.repositories.coupon_repository import CouponRepository
from app.schemas.admin_coupon import (
    AdminCouponCreateRequest,
    AdminCouponResponse,
    AdminCouponUpdateRequest,
)
from app.schemas.common import PaginatedResponse
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

from app.repositories.payment_repository import PaymentRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.admin_bulk import BulkActionResponse, BulkIdsRequest, BulkActionItemResult
from app.services.admin_bulk_service import AdminBulkService
from app.services.admin_service import AdminService
from app.repositories.admin_repository import AdminRepository
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/admin", tags=["admin-coupons"])


@router.get("/coupons", response_model=PaginatedResponse)
def list_coupons(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    coupon_repo = CouponRepository(db)
    audit_service = AuditService(AuditRepository(db))

    coupons = coupon_repo.list_coupons(skip=pagination.offset, limit=pagination.limit)
    total = coupon_repo.count_coupons()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_coupons",
        resource_type="coupon",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(coupons),
        },
    )
    db.commit()

    items = [
        AdminCouponResponse(
            id=str(c.id),
            code=c.code,
            name=c.name,
            coupon_type=c.coupon_type.value if hasattr(c.coupon_type, "value") else str(c.coupon_type),
            applicable_product_type=c.applicable_product_type.value if hasattr(c.applicable_product_type, "value") else str(c.applicable_product_type),
            discount_value=c.discount_value,
            max_discount_amount=c.max_discount_amount,
            min_booking_amount=c.min_booking_amount,
            usage_limit_total=c.usage_limit_total,
            usage_limit_per_user=c.usage_limit_per_user,
            used_count=c.used_count,
            is_active=c.is_active,
        ).model_dump()
        for c in coupons
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.post("/coupons", response_model=AdminCouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(
    payload: AdminCouponCreateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminCouponResponse:
    coupon_repo = CouponRepository(db)
    audit_service = AuditService(AuditRepository(db))

    existing = coupon_repo.get_by_code(payload.code)
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    try:
        coupon_type = CouponType(payload.coupon_type)
        applicable_product_type = CouponApplicableProductType(payload.applicable_product_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid coupon configuration") from exc

    with db.begin():
        coupon = Coupon(
            code=payload.code,
            name=payload.name,
            coupon_type=coupon_type,
            applicable_product_type=applicable_product_type,
            discount_value=payload.discount_value,
            max_discount_amount=payload.max_discount_amount,
            min_booking_amount=payload.min_booking_amount,
            usage_limit_total=payload.usage_limit_total,
            usage_limit_per_user=payload.usage_limit_per_user,
            starts_at=payload.starts_at,
            expires_at=payload.expires_at,
            is_active=payload.is_active,
            created_by=current_user.id,
            used_count=0,
        )
        coupon_repo.add_coupon(coupon)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_create_coupon",
            resource_type="coupon",
            resource_id=coupon.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"code": coupon.code, "name": coupon.name},
        )

    db.refresh(coupon)

    return AdminCouponResponse(
        id=str(coupon.id),
        code=coupon.code,
        name=coupon.name,
        coupon_type=coupon.coupon_type.value if hasattr(coupon.coupon_type, "value") else str(coupon.coupon_type),
        applicable_product_type=coupon.applicable_product_type.value if hasattr(coupon.applicable_product_type, "value") else str(coupon.applicable_product_type),
        discount_value=coupon.discount_value,
        max_discount_amount=coupon.max_discount_amount,
        min_booking_amount=coupon.min_booking_amount,
        usage_limit_total=coupon.usage_limit_total,
        usage_limit_per_user=coupon.usage_limit_per_user,
        used_count=coupon.used_count,
        is_active=coupon.is_active,
    )


@router.put("/coupons/{coupon_id}", response_model=AdminCouponResponse)
def update_coupon(
    coupon_id: str,
    payload: AdminCouponUpdateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminCouponResponse:
    coupon_repo = CouponRepository(db)
    audit_service = AuditService(AuditRepository(db))

    coupon = coupon_repo.get_by_id(coupon_id)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    if "applicable_product_type" in update_data and update_data["applicable_product_type"] is not None:
        try:
            update_data["applicable_product_type"] = CouponApplicableProductType(update_data["applicable_product_type"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid applicable product type") from exc

    with db.begin():
        for field, value in update_data.items():
            setattr(coupon, field, value)

        coupon_repo.save_coupon(coupon)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_update_coupon",
            resource_type="coupon",
            resource_id=coupon.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"updated_fields": list(update_data.keys())},
        )

    db.refresh(coupon)

    return AdminCouponResponse(
        id=str(coupon.id),
        code=coupon.code,
        name=coupon.name,
        coupon_type=coupon.coupon_type.value if hasattr(coupon.coupon_type, "value") else str(coupon.coupon_type),
        applicable_product_type=coupon.applicable_product_type.value if hasattr(coupon.applicable_product_type, "value") else str(coupon.applicable_product_type),
        discount_value=coupon.discount_value,
        max_discount_amount=coupon.max_discount_amount,
        min_booking_amount=coupon.min_booking_amount,
        usage_limit_total=coupon.usage_limit_total,
        usage_limit_per_user=coupon.usage_limit_per_user,
        used_count=coupon.used_count,
        is_active=coupon.is_active,
    )


@router.post("/coupons/{coupon_id}/deactivate", response_model=AdminCouponResponse)
def deactivate_coupon(
    coupon_id: str,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminCouponResponse:
    coupon_repo = CouponRepository(db)
    audit_service = AuditService(AuditRepository(db))

    coupon = coupon_repo.get_by_id(coupon_id)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    with db.begin():
        coupon.is_active = False
        coupon_repo.save_coupon(coupon)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_deactivate_coupon",
            resource_type="coupon",
            resource_id=coupon.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"code": coupon.code},
        )

    db.refresh(coupon)

    return AdminCouponResponse(
        id=str(coupon.id),
        code=coupon.code,
        name=coupon.name,
        coupon_type=coupon.coupon_type.value if hasattr(coupon.coupon_type, "value") else str(coupon.coupon_type),
        applicable_product_type=coupon.applicable_product_type.value if hasattr(coupon.applicable_product_type, "value") else str(coupon.applicable_product_type),
        discount_value=coupon.discount_value,
        max_discount_amount=coupon.max_discount_amount,
        min_booking_amount=coupon.min_booking_amount,
        usage_limit_total=coupon.usage_limit_total,
        usage_limit_per_user=coupon.usage_limit_per_user,
        used_count=coupon.used_count,
        is_active=coupon.is_active,
    )

@router.post("/coupons/bulk-deactivate", response_model=BulkActionResponse)
def bulk_deactivate_coupons(
    payload: BulkIdsRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> BulkActionResponse:
    coupon_repo = CouponRepository(db)
    audit_service = AuditService(AuditRepository(db))
    bulk_service = AdminBulkService(
        coupon_repo=coupon_repo,
        tour_repo=TourRepository(db),
        payment_repo=PaymentRepository(db),
        admin_service=AdminService(
            user_repo=UserRepository(db),
            admin_repo=AdminRepository(db),
            payment_repo=PaymentRepository(db),
            audit_service=audit_service,
        ),
    )

    with db.begin():
        raw_results = bulk_service.bulk_deactivate_coupons(payload.ids)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_bulk_deactivate_coupons",
            resource_type="coupon",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={
                "requested_ids": payload.ids,
                "success_count": sum(1 for r in raw_results if r["success"]),
                "failed_count": sum(1 for r in raw_results if not r["success"]),
            },
        )

    results = [BulkActionItemResult(**item) for item in raw_results]
    return BulkActionResponse(
        total_requested=len(payload.ids),
        success_count=sum(1 for r in raw_results if r["success"]),
        failed_count=sum(1 for r in raw_results if not r["success"]),
        results=results,
    )