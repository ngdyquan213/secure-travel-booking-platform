from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.booking import Booking, BookingItem
from app.models.enums import BookingItemType, BookingStatus, LogActorType, PaymentStatus
from app.models.user import User
from app.repositories.booking_repository import BookingRepository
from app.repositories.flight_repository import FlightRepository
from app.schemas.booking import BookingCreateRequest
from app.services.audit_service import AuditService
from app.workers.email_worker import EmailWorker
from app.workers.notification_worker import NotificationWorker


class BookingService:
    def __init__(
        self,
        db: Session,
        booking_repo: BookingRepository,
        flight_repo: FlightRepository,
        audit_service: AuditService,
        email_worker: EmailWorker | None = None,
        notification_worker: NotificationWorker | None = None,
    ) -> None:
        self.db = db
        self.booking_repo = booking_repo
        self.flight_repo = flight_repo
        self.audit_service = audit_service
        self.email_worker = email_worker or EmailWorker()
        self.notification_worker = notification_worker or NotificationWorker()

    def create_booking(
        self,
        *,
        user_id: str,
        payload: BookingCreateRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Booking:
        with self.db.begin():
            flight = self.flight_repo.get_by_id_for_update(payload.flight_id)
            if not flight:
                raise ValueError("Flight not found")

            if flight.status != "scheduled":
                raise ValueError("Flight is not bookable")

            if flight.available_seats < payload.quantity:
                raise ValueError("Not enough available seats")

            total_price = Decimal(flight.base_price) * payload.quantity

            booking = Booking(
                booking_code=f"BK-{uuid4().hex[:10].upper()}",
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
                item_type=BookingItemType.flight,
                flight_id=flight.id,
                quantity=payload.quantity,
                unit_price=flight.base_price,
                total_price=total_price,
            )
            self.booking_repo.add_booking_item(item)

            flight.available_seats -= payload.quantity
            self.flight_repo.save(flight)

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="booking_created",
                resource_type="booking",
                resource_id=booking.id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "flight_id": str(flight.id),
                    "quantity": payload.quantity,
                    "total_price": str(total_price),
                },
            )

        self.db.refresh(booking)

        user = self.db.query(User).filter(User.id == booking.user_id).first()
        if user:
            self.email_worker.send_booking_created_email(
                to_email=user.email,
                full_name=user.full_name,
                booking_code=booking.booking_code,
                total_amount=str(booking.total_final_amount),
                currency=booking.currency,
            )

        self.notification_worker.notify_booking_created(
            user_id=str(booking.user_id),
            booking_id=str(booking.id),
            booking_code=booking.booking_code,
        )

        return booking

    def list_my_bookings(self, user_id: str) -> list[Booking]:
        return self.booking_repo.list_by_user_id(user_id)