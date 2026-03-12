from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_pagination_params
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.flight_repository import FlightRepository
from app.repositories.hotel_repository import HotelRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.booking import (
    BookingCreateRequest,
    BookingResponse,
    HotelBookingCreateRequest,
    TourBookingCreateRequest,
)
from app.schemas.common import PaginatedResponse
from app.services.audit_service import AuditService
from app.services.booking_service import BookingService
from app.services.hotel_booking_service import HotelBookingService
from app.services.tour_booking_service import TourBookingService
from app.utils.pagination import PaginationParams, build_paginated_response
from app.utils.response_mappers import booking_to_dict

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreateRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    audit_service = AuditService(AuditRepository(db))
    service = BookingService(
        db=db,
        booking_repo=BookingRepository(db),
        flight_repo=FlightRepository(db),
        audit_service=audit_service,
    )

    booking = service.create_booking(
        user_id=str(current_user.id),
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return BookingResponse(**booking_to_dict(booking))


@router.post("/hotels", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_hotel_booking(
    payload: HotelBookingCreateRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    audit_service = AuditService(AuditRepository(db))
    service = HotelBookingService(
        db=db,
        booking_repo=BookingRepository(db),
        hotel_repo=HotelRepository(db),
        audit_service=audit_service,
    )

    booking = service.create_hotel_booking(
        user_id=str(current_user.id),
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return BookingResponse(**booking_to_dict(booking))


@router.post("/tours", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_tour_booking(
    payload: TourBookingCreateRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingResponse:
    audit_service = AuditService(AuditRepository(db))
    service = TourBookingService(
        db=db,
        booking_repo=BookingRepository(db),
        tour_repo=TourRepository(db),
        audit_service=audit_service,
    )

    booking = service.create_tour_booking(
        user_id=str(current_user.id),
        user_email=current_user.email,
        user_full_name=current_user.full_name,
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return BookingResponse(**booking_to_dict(booking))


@router.get("", response_model=PaginatedResponse)
def list_my_bookings(
    current_user=Depends(get_current_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
):
    audit_service = AuditService(AuditRepository(db))
    service = BookingService(
        db=db,
        booking_repo=BookingRepository(db),
        flight_repo=FlightRepository(db),
        audit_service=audit_service,
    )

    all_bookings = service.list_my_bookings(str(current_user.id))
    total = len(all_bookings)
    bookings = all_bookings[pagination.offset : pagination.offset + pagination.limit]

    items = [booking_to_dict(b) for b in bookings]

    return build_paginated_response(
        items=items,
        page=pagination.page,
        page_size=pagination.page_size,
        total=total,
    )