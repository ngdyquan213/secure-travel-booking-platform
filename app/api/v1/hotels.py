from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_pagination_params
from app.core.database import get_db
from app.models.enums import LogActorType
from app.repositories.audit_repository import AuditRepository
from app.repositories.hotel_repository import HotelRepository
from app.schemas.common import PaginatedResponse
from app.schemas.hotel import HotelResponse, HotelRoomResponse
from app.services.audit_service import AuditService
from app.services.hotel_service import HotelService
from app.utils.pagination import PaginationParams, build_paginated_response

router = APIRouter(prefix="/hotels", tags=["hotels"])


@router.get("", response_model=PaginatedResponse)
def list_hotels(
    request: Request,
    pagination: PaginationParams = Depends(get_pagination_params),
    city: str | None = Query(default=None),
    country: str | None = Query(default=None),
    min_star_rating: int | None = Query(default=None, ge=1, le=5),
    sort_by: str = Query(default="name"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    repo = HotelRepository(db)
    service = HotelService(repo)
    audit_service = AuditService(AuditRepository(db))

    hotels = service.list_hotels(
        skip=pagination.offset,
        limit=pagination.limit,
        city=city,
        country=country,
        min_star_rating=min_star_rating,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    total = repo.count_hotels(
        city=city,
        country=country,
        min_star_rating=min_star_rating,
    )

    items = [
        HotelResponse(
            id=str(h.id),
            name=h.name,
            city=h.city,
            country=h.country,
            star_rating=h.star_rating,
            description=h.description,
            rooms=[
                HotelRoomResponse(
                    id=str(r.id),
                    hotel_id=str(r.hotel_id),
                    room_type=r.room_type,
                    capacity=r.capacity,
                    base_price_per_night=r.base_price_per_night,
                    total_rooms=r.total_rooms,
                )
                for r in h.rooms
            ],
        ).model_dump()
        for h in hotels
    ]

    audit_service.log_action(
        actor_type=LogActorType.system,
        action="hotels_list_viewed",
        resource_type="hotel",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata={
            "page": pagination.page,
            "page_size": pagination.page_size,
            "city": city,
            "country": country,
            "min_star_rating": min_star_rating,
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


@router.get("/{hotel_id}", response_model=HotelResponse)
def get_hotel(
    hotel_id: str,
    db: Session = Depends(get_db),
) -> HotelResponse:
    repo = HotelRepository(db)
    service = HotelService(repo)

    hotel = service.get_hotel(hotel_id)

    return HotelResponse(
        id=str(hotel.id),
        name=hotel.name,
        city=hotel.city,
        country=hotel.country,
        star_rating=hotel.star_rating,
        description=hotel.description,
        rooms=[
            HotelRoomResponse(
                id=str(r.id),
                hotel_id=str(r.hotel_id),
                room_type=r.room_type,
                capacity=r.capacity,
                base_price_per_night=r.base_price_per_night,
                total_rooms=r.total_rooms,
            )
            for r in hotel.rooms
        ],
    )