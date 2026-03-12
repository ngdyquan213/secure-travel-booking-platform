from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.audit_repository import AuditRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.common import PaginatedResponse
from app.schemas.tour import (
    TourItineraryResponse,
    TourPolicyResponse,
    TourPriceRuleResponse,
    TourResponse,
    TourScheduleResponse,
)
from app.services.audit_service import AuditService
from app.services.tour_service import TourService
from app.utils.pagination import PaginationParams, build_paginated_response

router = APIRouter(prefix="/tours", tags=["tours"])


@router.get("", response_model=PaginatedResponse)
def list_tours(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    destination: str | None = Query(default=None),
    status: str | None = Query(default=None),
    tour_type: str | None = Query(default=None),
    sort_by: str = Query(default="name"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    repo = TourRepository(db)
    service = TourService(repo)
    audit_service = AuditService(AuditRepository(db))

    tours = service.list_tours(
        skip=pagination.offset,
        limit=pagination.limit,
        destination=destination,
        status=status,
        tour_type=tour_type,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total = repo.count_tours(
        destination=destination,
        status=status,
        tour_type=tour_type,
    )

    items = [
        TourResponse(
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
            schedules=[
                TourScheduleResponse(
                    id=str(s.id),
                    departure_date=s.departure_date,
                    return_date=s.return_date,
                    capacity=s.capacity,
                    available_slots=s.available_slots,
                    status=s.status.value if hasattr(s.status, "value") else str(s.status),
                    price_rules=[
                        TourPriceRuleResponse(
                            id=str(r.id),
                            traveler_type=r.traveler_type.value if hasattr(r.traveler_type, "value") else str(r.traveler_type),
                            price=r.price,
                            currency=r.currency,
                        )
                        for r in s.price_rules
                    ],
                )
                for s in t.schedules
            ],
            itineraries=[
                TourItineraryResponse(
                    id=str(i.id),
                    day_number=i.day_number,
                    title=i.title,
                    description=i.description,
                )
                for i in t.itineraries
            ],
            policies=[
                TourPolicyResponse(
                    id=str(p.id),
                    cancellation_policy=p.cancellation_policy,
                    refund_policy=p.refund_policy,
                    notes=p.notes,
                )
                for p in t.policies
            ],
        ).model_dump()
        for t in tours
    ]

    audit_service.log_action(
        actor_type=LogActorType.system,
        action="tours_list_viewed",
        resource_type="tour",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "destination": destination,
            "status": status,
            "tour_type": tour_type,
            "sort_by": sort_by,
            "sort_order": sort_order,
            "result_count": len(items),
        },
    )
    db.commit()

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(
    tour_id: str,
    request: Request,
    db: Session = Depends(get_db),
) -> TourResponse:
    service = TourService(TourRepository(db))
    audit_service = AuditService(AuditRepository(db))

    tour = service.get_tour(tour_id)

    audit_service.log_action(
        actor_type=LogActorType.system,
        action="tour_detail_viewed",
        resource_type="tour",
        resource_id=tour.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={"tour_id": str(tour.id)},
    )
    db.commit()

    return TourResponse(
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
        schedules=[
            TourScheduleResponse(
                id=str(s.id),
                departure_date=s.departure_date,
                return_date=s.return_date,
                capacity=s.capacity,
                available_slots=s.available_slots,
                status=s.status.value if hasattr(s.status, "value") else str(s.status),
                price_rules=[
                    TourPriceRuleResponse(
                        id=str(r.id),
                        traveler_type=r.traveler_type.value if hasattr(r.traveler_type, "value") else str(r.traveler_type),
                        price=r.price,
                        currency=r.currency,
                    )
                    for r in s.price_rules
                ],
            )
            for s in tour.schedules
        ],
        itineraries=[
            TourItineraryResponse(
                id=str(i.id),
                day_number=i.day_number,
                title=i.title,
                description=i.description,
            )
            for i in tour.itineraries
        ],
        policies=[
            TourPolicyResponse(
                id=str(p.id),
                cancellation_policy=p.cancellation_policy,
                refund_policy=p.refund_policy,
                notes=p.notes,
            )
            for p in tour.policies
        ],
    )