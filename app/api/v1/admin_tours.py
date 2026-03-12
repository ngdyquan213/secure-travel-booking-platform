from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params, require_admin
from app.core.database import get_db
from app.models.enums import LogActorType, TourScheduleStatus, TourStatus, TravelerType
from app.models.tour import Tour, TourPriceRule, TourSchedule
from app.repositories.audit_repository import AuditRepository
from app.repositories.tour_repository import TourRepository
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
from app.services.audit_service import AuditService
from app.utils.pagination import PaginationParams, build_paginated_response

from app.repositories.coupon_repository import CouponRepository
from app.repositories.payment_repository import PaymentRepository
from app.schemas.admin_bulk import BulkActionResponse, BulkIdsRequest, BulkActionItemResult
from app.services.admin_bulk_service import AdminBulkService
from app.services.admin_service import AdminService
from app.repositories.admin_repository import AdminRepository
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/admin", tags=["admin-tours"])


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
        raise HTTPException(status_code=400, detail="Tour code already exists")

    try:
        tour_status = TourStatus(payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid tour status") from exc

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
        raise HTTPException(status_code=404, detail="Tour not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    if "status" in update_data and update_data["status"] is not None:
        try:
            update_data["status"] = TourStatus(update_data["status"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid tour status") from exc

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
        raise HTTPException(status_code=404, detail="Tour not found")

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
        raise HTTPException(status_code=404, detail="Tour not found")

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


@router.post("/tours/{tour_id}/schedules", response_model=AdminTourScheduleResponse, status_code=status.HTTP_201_CREATED)
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
        raise HTTPException(status_code=404, detail="Tour not found")

    if payload.return_date <= payload.departure_date:
        raise HTTPException(status_code=400, detail="return_date must be after departure_date")

    if payload.available_slots > payload.capacity:
        raise HTTPException(status_code=400, detail="available_slots cannot exceed capacity")

    try:
        schedule_status = TourScheduleStatus(payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid schedule status") from exc

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
        raise HTTPException(status_code=404, detail="Tour schedule not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    departure_date = update_data.get("departure_date", schedule.departure_date)
    return_date = update_data.get("return_date", schedule.return_date)
    capacity = update_data.get("capacity", schedule.capacity)
    available_slots = update_data.get("available_slots", schedule.available_slots)

    if return_date <= departure_date:
        raise HTTPException(status_code=400, detail="return_date must be after departure_date")

    if available_slots > capacity:
        raise HTTPException(status_code=400, detail="available_slots cannot exceed capacity")

    if "status" in update_data and update_data["status"] is not None:
        try:
            update_data["status"] = TourScheduleStatus(update_data["status"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid schedule status") from exc

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
        raise HTTPException(status_code=404, detail="Tour schedule not found")

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


@router.post("/tour-schedules/{schedule_id}/price-rules", response_model=AdminTourPriceRuleResponse, status_code=status.HTTP_201_CREATED)
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
        raise HTTPException(status_code=404, detail="Tour schedule not found")

    try:
        traveler_type = TravelerType(payload.traveler_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid traveler type") from exc

    for existing in schedule.price_rules:
        if existing.traveler_type == traveler_type:
            raise HTTPException(status_code=400, detail="Price rule for this traveler type already exists")

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

@router.post("/tour-schedules/bulk-close", response_model=BulkActionResponse)
def bulk_close_tour_schedules(
    payload: BulkIdsRequest,
    request: Request,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
) -> BulkActionResponse:
    audit_service = AuditService(AuditRepository(db))
    bulk_service = AdminBulkService(
        coupon_repo=CouponRepository(db),
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
        raw_results = bulk_service.bulk_close_tour_schedules(payload.ids)

        audit_service.log_action(
            actor_type=LogActorType.admin,
            actor_user_id=current_user.id,
            action="admin_bulk_close_tour_schedules",
            resource_type="tour_schedule",
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