from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.audit_repository import AuditRepository
from app.repositories.flight_repository import FlightRepository
from app.schemas.common import PaginatedResponse
from app.schemas.flight import FlightResponse
from app.services.audit_service import AuditService
from app.services.flight_service import FlightService
from app.utils.pagination import PaginationParams, build_paginated_response

router = APIRouter(prefix="/flights", tags=["flights"])


@router.get("", response_model=PaginatedResponse)
def list_flights(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    departure_airport_code: str | None = Query(default=None),
    arrival_airport_code: str | None = Query(default=None),
    status: str | None = Query(default=None),
    sort_by: str = Query(default="departure_time"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    repo = FlightRepository(db)
    service = FlightService(repo)
    audit_service = AuditService(AuditRepository(db))

    flights = service.list_flights(
        skip=pagination.offset,
        limit=pagination.limit,
        departure_airport_code=departure_airport_code,
        arrival_airport_code=arrival_airport_code,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total = repo.count_flights(
        departure_airport_code=departure_airport_code,
        arrival_airport_code=arrival_airport_code,
        status=status,
    )

    items = [
        FlightResponse(
            id=str(f.id),
            airline_id=str(f.airline_id),
            flight_number=f.flight_number,
            departure_airport_id=str(f.departure_airport_id),
            arrival_airport_id=str(f.arrival_airport_id),
            departure_time=f.departure_time,
            arrival_time=f.arrival_time,
            base_price=f.base_price,
            available_seats=f.available_seats,
            status=f.status,
        ).model_dump()
        for f in flights
    ]

    audit_service.log_action(
        actor_type=LogActorType.system,
        action="flights_list_viewed",
        resource_type="flight",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "departure_airport_code": departure_airport_code,
            "arrival_airport_code": arrival_airport_code,
            "status": status,
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


@router.get("/{flight_id}", response_model=FlightResponse)
def get_flight(
    flight_id: str,
    db: Session = Depends(get_db),
) -> FlightResponse:
    repo = FlightRepository(db)
    service = FlightService(repo)

    flight = service.get_flight(flight_id)

    return FlightResponse(
        id=str(flight.id),
        airline_id=str(flight.airline_id),
        flight_number=flight.flight_number,
        departure_airport_id=str(flight.departure_airport_id),
        arrival_airport_id=str(flight.arrival_airport_id),
        departure_time=flight.departure_time,
        arrival_time=flight.arrival_time,
        base_price=flight.base_price,
        available_seats=flight.available_seats,
        status=flight.status,
    )