from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.flight_repository import FlightRepository
from app.repositories.hotel_repository import HotelRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.tour_repository import TourRepository
from app.schemas.booking import BookingCancelRequest, BookingCancelResponse
from app.services.audit_service import AuditService
from app.services.booking_cancellation_service import BookingCancellationService

router = APIRouter(prefix="/bookings", tags=["booking-cancellations"])


@router.post("/{booking_id}/cancel", response_model=BookingCancelResponse)
def cancel_booking(
    booking_id: str,
    payload: BookingCancelRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingCancelResponse:
    audit_service = AuditService(AuditRepository(db))
    service = BookingCancellationService(
        db=db,
        booking_repo=BookingRepository(db),
        payment_repo=PaymentRepository(db),
        flight_repo=FlightRepository(db),
        hotel_repo=HotelRepository(db),
        tour_repo=TourRepository(db),
        audit_service=audit_service,
    )

    booking, payment, refund = service.cancel_booking(
        booking_id=booking_id,
        user_id=str(current_user.id),
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    refund_amount = refund.amount if refund else 0
    refund_currency = refund.currency if refund else booking.currency
    refund_status = (
        refund.status.value if refund and hasattr(refund.status, "value")
        else (str(refund.status) if refund else None)
    )

    return BookingCancelResponse(
        booking_id=str(booking.id),
        booking_code=booking.booking_code,
        status=booking.status.value if hasattr(booking.status, "value") else str(booking.status),
        payment_status=booking.payment_status.value if hasattr(booking.payment_status, "value") else str(booking.payment_status),
        refund_amount=refund_amount,
        refund_currency=refund_currency,
        refund_status=refund_status,
        cancellation_reason=booking.cancellation_reason,
    )