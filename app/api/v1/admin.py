from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.coupon import Coupon
from app.models.enums import (
    CouponApplicableProductType,
    CouponType,
    LogActorType,
    TourScheduleStatus,
    TourStatus,
    TravelerType,
)
from app.models.tour import Tour, TourPriceRule, TourSchedule
from app.repositories.admin_repository import AdminRepository
from app.repositories.audit_repository import AuditRepository
from app.repositories.coupon_repository import CouponRepository
from app.repositories.tour_repository import TourRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin import (
    AdminAuditLogResponse,
    AdminBookingResponse,
    AdminPaymentResponse,
    AdminUserResponse,
)
from app.schemas.admin_coupon import (
    AdminCouponCreateRequest,
    AdminCouponResponse,
    AdminCouponUpdateRequest,
)
from app.schemas.admin_tour import (
    AdminTourCreateRequest,
    AdminTourPriceRuleCreateRequest,
    AdminTourPriceRuleResponse,
    AdminTourResponse,
    AdminTourScheduleCreateRequest,
    AdminTourScheduleResponse,
    AdminTourScheduleUpdateRequest,
    AdminTourUpdateRequest,
)
from app.schemas.common import PaginatedResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

from app.repositories.payment_repository import PaymentRepository
from app.schemas.admin_refund import AdminRefundResponse, AdminRefundUpdateRequest

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=PaginatedResponse)
def list_users(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    user_repo = UserRepository(db)
    service = AdminService(
        user_repo=user_repo,
        admin_repo=AdminRepository(db),
    )
    audit_service = AuditService(AuditRepository(db))

    users = service.list_users(skip=pagination.offset, limit=pagination.limit)
    total = user_repo.count_users()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_users",
        resource_type="user",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(users),
        },
    )
    db.commit()

    items = [
        AdminUserResponse(
            id=str(u.id),
            email=u.email,
            username=u.username,
            full_name=u.full_name,
            status=u.status.value if hasattr(u.status, "value") else str(u.status),
        ).model_dump()
        for u in users
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/bookings", response_model=PaginatedResponse)
def list_bookings(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    bookings = service.list_bookings(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_bookings()

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
            "result_count": len(bookings),
        },
    )
    db.commit()

    items = [
        AdminBookingResponse(
            id=str(b.id),
            booking_code=b.booking_code,
            user_id=str(b.user_id),
            status=b.status.value if hasattr(b.status, "value") else str(b.status),
            total_final_amount=b.total_final_amount,
            currency=b.currency,
            payment_status=b.payment_status.value if hasattr(b.payment_status, "value") else str(b.payment_status),
            booked_at=b.booked_at,
        ).model_dump()
        for b in bookings
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/payments", response_model=PaginatedResponse)
def list_payments(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    payments = service.list_payments(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_payments()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_payments",
        resource_type="payment",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(payments),
        },
    )
    db.commit()

    items = [
        AdminPaymentResponse(
            id=str(p.id),
            booking_id=str(p.booking_id),
            payment_method=p.payment_method.value if hasattr(p.payment_method, "value") else str(p.payment_method),
            status=p.status.value if hasattr(p.status, "value") else str(p.status),
            amount=p.amount,
            currency=p.currency,
            gateway_order_ref=p.gateway_order_ref,
            gateway_transaction_ref=p.gateway_transaction_ref,
            created_at=p.created_at,
        ).model_dump()
        for p in payments
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/audit-logs", response_model=PaginatedResponse)
def list_audit_logs(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )
    audit_service = AuditService(AuditRepository(db))

    logs = service.list_audit_logs(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_audit_logs()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_audit_logs",
        resource_type="audit_log",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(logs),
        },
    )
    db.commit()

    items = [
        AdminAuditLogResponse(
            id=str(log.id),
            actor_type=log.actor_type.value if hasattr(log.actor_type, "value") else str(log.actor_type),
            actor_user_id=str(log.actor_user_id) if log.actor_user_id else None,
            action=log.action,
            resource_type=log.resource_type,
            resource_id=str(log.resource_id) if log.resource_id else None,
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
        ).model_dump()
        for log in logs
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Coupon code already exists",
        )

    try:
        coupon_type = CouponType(payload.coupon_type)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid coupon type",
        ) from exc

    try:
        applicable_product_type = CouponApplicableProductType(payload.applicable_product_type)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid applicable product type",
        ) from exc

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    if "applicable_product_type" in update_data and update_data["applicable_product_type"] is not None:
        try:
            update_data["applicable_product_type"] = CouponApplicableProductType(update_data["applicable_product_type"])
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid applicable product type",
            ) from exc

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found",
        )

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


@router.get("/tours", response_model=PaginatedResponse)
def list_tours_admin(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    tours = tour_repo.list_tours(skip=pagination.offset, limit=pagination.limit)
    total = tour_repo.count_tours()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_tours",
        resource_type="tour",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(tours),
        },
    )
    db.commit()

    items = [
        AdminTourResponse(
            id=str(t.id),
            code=t.code,
            name=t.name,
            destination=t.destination,
            description=t.description,
            duration_days=t.duration_days,
            duration_nights=t.duration_nights,
            meeting_point=t.meeting_point,
            tour_type=t.tour_type,
            status=t.status.value if hasattr(t.status, "value") else str(t.status),
        ).model_dump()
        for t in tours
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.post("/tours", response_model=AdminTourResponse, status_code=status.HTTP_201_CREATED)
def create_tour_admin(
    payload: AdminTourCreateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    if tour_repo.get_by_code(payload.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tour code already exists",
        )

    try:
        tour_status = TourStatus(payload.status)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid tour status",
        ) from exc

    with db.begin():
        tour = Tour(
            code=payload.code,
            name=payload.name,
            destination=payload.destination,
            description=payload.description,
            duration_days=payload.duration_days,
            duration_nights=payload.duration_nights,
            meeting_point=payload.meeting_point,
            tour_type=payload.tour_type,
            status=tour_status,
        )
        tour_repo.add_tour(tour)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_create_tour",
            resource_type="tour",
            resource_id=tour.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"code": tour.code, "name": tour.name},
        )

    db.refresh(tour)

    return AdminTourResponse(
        id=str(tour.id),
        code=tour.code,
        name=tour.name,
        destination=tour.destination,
        description=tour.description,
        duration_days=tour.duration_days,
        duration_nights=tour.duration_nights,
        meeting_point=tour.meeting_point,
        tour_type=tour.tour_type,
        status=tour.status.value if hasattr(tour.status, "value") else str(tour.status),
    )


@router.put("/tours/{tour_id}", response_model=AdminTourResponse)
def update_tour_admin(
    tour_id: str,
    payload: AdminTourUpdateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    tour = tour_repo.get_by_id(tour_id)
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    if "status" in update_data and update_data["status"] is not None:
        try:
            update_data["status"] = TourStatus(update_data["status"])
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tour status",
            ) from exc

    with db.begin():
        for field, value in update_data.items():
            setattr(tour, field, value)

        tour_repo.save_tour(tour)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_update_tour",
            resource_type="tour",
            resource_id=tour.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"updated_fields": list(update_data.keys())},
        )

    db.refresh(tour)

    return AdminTourResponse(
        id=str(tour.id),
        code=tour.code,
        name=tour.name,
        destination=tour.destination,
        description=tour.description,
        duration_days=tour.duration_days,
        duration_nights=tour.duration_nights,
        meeting_point=tour.meeting_point,
        tour_type=tour.tour_type,
        status=tour.status.value if hasattr(tour.status, "value") else str(tour.status),
    )


@router.post("/tours/{tour_id}/deactivate", response_model=AdminTourResponse)
def deactivate_tour_admin(
    tour_id: str,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    tour = tour_repo.get_by_id(tour_id)
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    with db.begin():
        tour.status = TourStatus.inactive
        tour_repo.save_tour(tour)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_deactivate_tour",
            resource_type="tour",
            resource_id=tour.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"code": tour.code},
        )

    db.refresh(tour)

    return AdminTourResponse(
        id=str(tour.id),
        code=tour.code,
        name=tour.name,
        destination=tour.destination,
        description=tour.description,
        duration_days=tour.duration_days,
        duration_nights=tour.duration_nights,
        meeting_point=tour.meeting_point,
        tour_type=tour.tour_type,
        status=tour.status.value if hasattr(tour.status, "value") else str(tour.status),
    )


@router.get("/tours/{tour_id}/schedules", response_model=list[AdminTourScheduleResponse])
def list_tour_schedules_admin(
    tour_id: str,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[AdminTourScheduleResponse]:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    tour = tour_repo.get_by_id(tour_id)
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    schedules = tour_repo.list_schedules_by_tour_id(tour_id)

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_tour_schedules",
        resource_type="tour_schedule",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"tour_id": tour_id, "result_count": len(schedules)},
    )
    db.commit()

    return [
        AdminTourScheduleResponse(
            id=str(s.id),
            tour_id=str(s.tour_id),
            departure_date=s.departure_date,
            return_date=s.return_date,
            capacity=s.capacity,
            available_slots=s.available_slots,
            status=s.status.value if hasattr(s.status, "value") else str(s.status),
        )
        for s in schedules
    ]


@router.post(
    "/tours/{tour_id}/schedules",
    response_model=AdminTourScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tour_schedule_admin(
    tour_id: str,
    payload: AdminTourScheduleCreateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourScheduleResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    tour = tour_repo.get_by_id(tour_id)
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    if payload.return_date <= payload.departure_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="return_date must be after departure_date",
        )

    if payload.available_slots > payload.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="available_slots cannot exceed capacity",
        )

    try:
        schedule_status = TourScheduleStatus(payload.status)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid schedule status",
        ) from exc

    with db.begin():
        schedule = TourSchedule(
            tour_id=tour.id,
            departure_date=payload.departure_date,
            return_date=payload.return_date,
            capacity=payload.capacity,
            available_slots=payload.available_slots,
            status=schedule_status,
        )
        tour_repo.add_schedule(schedule)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_create_tour_schedule",
            resource_type="tour_schedule",
            resource_id=schedule.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"tour_id": str(tour.id)},
        )

    db.refresh(schedule)

    return AdminTourScheduleResponse(
        id=str(schedule.id),
        tour_id=str(schedule.tour_id),
        departure_date=schedule.departure_date,
        return_date=schedule.return_date,
        capacity=schedule.capacity,
        available_slots=schedule.available_slots,
        status=schedule.status.value if hasattr(schedule.status, "value") else str(schedule.status),
    )


@router.put("/tour-schedules/{schedule_id}", response_model=AdminTourScheduleResponse)
def update_tour_schedule_admin(
    schedule_id: str,
    payload: AdminTourScheduleUpdateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourScheduleResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    schedule = tour_repo.get_schedule_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour schedule not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    departure_date = update_data.get("departure_date", schedule.departure_date)
    return_date = update_data.get("return_date", schedule.return_date)
    capacity = update_data.get("capacity", schedule.capacity)
    available_slots = update_data.get("available_slots", schedule.available_slots)

    if return_date <= departure_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="return_date must be after departure_date",
        )

    if available_slots > capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="available_slots cannot exceed capacity",
        )

    if "status" in update_data and update_data["status"] is not None:
        try:
            update_data["status"] = TourScheduleStatus(update_data["status"])
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid schedule status",
            ) from exc

    with db.begin():
        for field, value in update_data.items():
            setattr(schedule, field, value)

        tour_repo.save_schedule(schedule)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_update_tour_schedule",
            resource_type="tour_schedule",
            resource_id=schedule.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"updated_fields": list(update_data.keys())},
        )

    db.refresh(schedule)

    return AdminTourScheduleResponse(
        id=str(schedule.id),
        tour_id=str(schedule.tour_id),
        departure_date=schedule.departure_date,
        return_date=schedule.return_date,
        capacity=schedule.capacity,
        available_slots=schedule.available_slots,
        status=schedule.status.value if hasattr(schedule.status, "value") else str(schedule.status),
    )


@router.post("/tour-schedules/{schedule_id}/deactivate", response_model=AdminTourScheduleResponse)
def deactivate_tour_schedule_admin(
    schedule_id: str,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourScheduleResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    schedule = tour_repo.get_schedule_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour schedule not found",
        )

    with db.begin():
        schedule.status = TourScheduleStatus.closed
        tour_repo.save_schedule(schedule)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_deactivate_tour_schedule",
            resource_type="tour_schedule",
            resource_id=schedule.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"tour_id": str(schedule.tour_id)},
        )

    db.refresh(schedule)

    return AdminTourScheduleResponse(
        id=str(schedule.id),
        tour_id=str(schedule.tour_id),
        departure_date=schedule.departure_date,
        return_date=schedule.return_date,
        capacity=schedule.capacity,
        available_slots=schedule.available_slots,
        status=schedule.status.value if hasattr(schedule.status, "value") else str(schedule.status),
    )


@router.post(
    "/tour-schedules/{schedule_id}/price-rules",
    response_model=AdminTourPriceRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tour_price_rule_admin(
    schedule_id: str,
    payload: AdminTourPriceRuleCreateRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminTourPriceRuleResponse:
    tour_repo = TourRepository(db)
    audit_service = AuditService(AuditRepository(db))

    schedule = tour_repo.get_schedule_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour schedule not found",
        )

    try:
        traveler_type = TravelerType(payload.traveler_type)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid traveler type",
        ) from exc

    for existing in schedule.price_rules:
        if existing.traveler_type == traveler_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price rule for this traveler type already exists",
            )

    with db.begin():
        rule = TourPriceRule(
            tour_schedule_id=schedule.id,
            traveler_type=traveler_type,
            price=payload.price,
            currency=payload.currency,
        )
        tour_repo.add_price_rule(rule)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_create_tour_price_rule",
            resource_type="tour_price_rule",
            resource_id=rule.id,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            metadata={"schedule_id": schedule_id, "traveler_type": payload.traveler_type},
        )

    db.refresh(rule)

    return AdminTourPriceRuleResponse(
        id=str(rule.id),
        tour_schedule_id=str(rule.tour_schedule_id),
        traveler_type=rule.traveler_type.value if hasattr(rule.traveler_type, "value") else str(rule.traveler_type),
        price=rule.price,
        currency=rule.currency,
    )

@router.get("/cancelled-bookings", response_model=PaginatedResponse)
def list_cancelled_bookings(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    audit_service = AuditService(AuditRepository(db))
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )

    bookings = service.list_cancelled_bookings(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_cancelled_bookings()

    audit_service.log_action(
        actor_type=LogActorType.admin,
        actor_user_id=current_user.id,
        action="admin_list_cancelled_bookings",
        resource_type="booking",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "result_count": len(bookings),
        },
    )
    db.commit()

    items = [
        AdminBookingResponse(
            id=str(b.id),
            booking_code=b.booking_code,
            user_id=str(b.user_id),
            status=b.status.value if hasattr(b.status, "value") else str(b.status),
            total_final_amount=b.total_final_amount,
            currency=b.currency,
            payment_status=b.payment_status.value if hasattr(b.payment_status, "value") else str(b.payment_status),
            booked_at=b.booked_at,
        ).model_dump()
        for b in bookings
    ]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/refunds", response_model=PaginatedResponse)
def list_refunds(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    admin_repo = AdminRepository(db)
    audit_service = AuditService(AuditRepository(db))
    service = AdminService(
        user_repo=UserRepository(db),
        admin_repo=admin_repo,
    )

    refunds = service.list_refunds(skip=pagination.offset, limit=pagination.limit)
    total = admin_repo.count_refunds()

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
            "result_count": len(refunds),
        },
    )
    db.commit()

    items = [
        AdminRefundResponse(
            id=str(r.id),
            payment_id=str(r.payment_id),
            amount=r.amount,
            currency=r.currency,
            status=r.status.value if hasattr(r.status, "value") else str(r.status),
            reason=r.reason,
            processed_at=r.processed_at,
            created_at=r.created_at,
        ).model_dump()
        for r in refunds
    ]

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

    try:
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
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    db.refresh(refund)

    return AdminRefundResponse(
        id=str(refund.id),
        payment_id=str(refund.payment_id),
        amount=refund.amount,
        currency=refund.currency,
        status=refund.status.value if hasattr(refund.status, "value") else str(refund.status),
        reason=refund.reason,
        processed_at=refund.processed_at,
        created_at=refund.created_at,
    )