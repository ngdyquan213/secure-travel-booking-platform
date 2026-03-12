from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.schemas.traveler import TravelerCreateRequest, TravelerResponse
from app.services.audit_service import AuditService
from app.services.traveler_service import TravelerService
from app.utils.response_mappers import traveler_to_dict

router = APIRouter(prefix="/bookings", tags=["booking-travelers"])


@router.get("/{booking_id}/travelers", response_model=list[TravelerResponse])
def list_booking_travelers(
    booking_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TravelerResponse]:
    audit_service = AuditService(AuditRepository(db))
    service = TravelerService(
        db=db,
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
    )

    travelers = service.list_travelers(
        booking_id=booking_id,
        user_id=str(current_user.id),
    )

    return [TravelerResponse(**traveler_to_dict(t)) for t in travelers]


@router.post("/{booking_id}/travelers", response_model=TravelerResponse, status_code=status.HTTP_201_CREATED)
def add_booking_traveler(
    booking_id: str,
    payload: TravelerCreateRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TravelerResponse:
    audit_service = AuditService(AuditRepository(db))
    service = TravelerService(
        db=db,
        booking_repo=BookingRepository(db),
        audit_service=audit_service,
    )

    traveler = service.add_traveler(
        booking_id=booking_id,
        user_id=str(current_user.id),
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return TravelerResponse(**traveler_to_dict(traveler))