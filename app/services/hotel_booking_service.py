from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.booking import Booking, BookingItem
from app.models.enums import BookingItemType, BookingStatus, LogActorType, PaymentStatus
from app.repositories.booking_repository import BookingRepository
from app.repositories.hotel_repository import HotelRepository
from app.schemas.booking import HotelBookingCreateRequest
from app.services.audit_service import AuditService


class HotelBookingService:
    def __init__(
        self,
        db: Session,
        booking_repo: BookingRepository,
        hotel_repo: HotelRepository,
        audit_service: AuditService,
    ) -> None:
        self.db = db
        self.booking_repo = booking_repo
        self.hotel_repo = hotel_repo
        self.audit_service = audit_service

    def create_hotel_booking(
        self,
        *,
        user_id: str,
        payload: HotelBookingCreateRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Booking:
        with self.db.begin():
            room = self.hotel_repo.get_room_by_id_for_update(payload.hotel_room_id)
            if not room:
                raise ValueError("Hotel room not found")

            nights = (payload.check_out_date - payload.check_in_date).days
            if nights <= 0:
                raise ValueError("Invalid stay duration")

            if room.total_rooms < payload.quantity:
                raise ValueError("Not enough available rooms")

            unit_price = Decimal(room.base_price_per_night)
            total_price = unit_price * payload.quantity * nights

            booking = Booking(
                booking_code=f"HB-{uuid4().hex[:10].upper()}",
                user_id=user_id,
                status=BookingStatus.pending,
                total_base_amount=total_price,
                total_discount_amount=Decimal("0.00"),
                total_final_amount=total_price,
                currency="VND",
                payment_status=PaymentStatus.pending,
                booked_at=datetime.now(timezone.utc),
            )
            self.booking_repo.add_booking(booking)

            item = BookingItem(
                booking_id=booking.id,
                item_type=BookingItemType.hotel,
                hotel_room_id=room.id,
                check_in_date=payload.check_in_date,
                check_out_date=payload.check_out_date,
                quantity=payload.quantity,
                unit_price=unit_price,
                total_price=total_price,
                metadata_json={
                    "nights": nights,
                    "room_type": room.room_type,
                },
            )
            self.booking_repo.add_booking_item(item)

            room.total_rooms -= payload.quantity
            self.hotel_repo.save_room(room)

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="hotel_booking_created",
                resource_type="booking",
                resource_id=booking.id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "hotel_room_id": str(room.id),
                    "quantity": payload.quantity,
                    "nights": nights,
                    "total_price": str(total_price),
                    "check_in_date": payload.check_in_date.isoformat(),
                    "check_out_date": payload.check_out_date.isoformat(),
                },
            )

        self.db.refresh(booking)
        return booking