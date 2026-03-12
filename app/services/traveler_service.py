from __future__ import annotations

from collections import Counter

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundAppException, ValidationAppException
from app.models.booking import Traveler
from app.models.enums import BookingItemType, DocumentType, LogActorType, TravelerType
from app.repositories.booking_repository import BookingRepository
from app.schemas.traveler import TravelerCreateRequest
from app.services.audit_service import AuditService


class TravelerService:
    def __init__(
        self,
        db: Session,
        booking_repo: BookingRepository,
        audit_service: AuditService,
    ) -> None:
        self.db = db
        self.booking_repo = booking_repo
        self.audit_service = audit_service

    def _get_expected_tour_counts(self, booking) -> dict[str, int]:
        if not booking.items:
            raise ValidationAppException("Booking has no items")

        if len(booking.items) != 1:
            raise ValidationAppException("Traveler management currently supports single-item booking only")

        item = booking.items[0]
        if item.item_type != BookingItemType.tour:
            raise ValidationAppException("Travelers can only be managed for tour bookings")

        metadata = item.metadata_json or {}
        return {
            "adult": int(metadata.get("adult_count", 0)),
            "child": int(metadata.get("child_count", 0)),
            "infant": int(metadata.get("infant_count", 0)),
        }

    def list_travelers(
        self,
        *,
        booking_id: str,
        user_id: str,
    ) -> list[Traveler]:
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")
        return booking.travelers

    def add_traveler(
        self,
        *,
        booking_id: str,
        user_id: str,
        payload: TravelerCreateRequest,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> Traveler:
        booking = self.booking_repo.get_by_id_and_user_id(booking_id, user_id)
        if not booking:
            raise NotFoundAppException("Booking not found")

        expected_counts = self._get_expected_tour_counts(booking)
        current_counts = Counter(
            t.traveler_type.value if hasattr(t.traveler_type, "value") else str(t.traveler_type)
            for t in booking.travelers
        )

        try:
            traveler_type = TravelerType(payload.traveler_type)
        except ValueError as exc:
            raise ValidationAppException("Invalid traveler type") from exc

        if current_counts[traveler_type.value] >= expected_counts[traveler_type.value]:
            raise ValidationAppException(f"Traveler count exceeded for type: {traveler_type.value}")

        document_type = None
        if payload.document_type is not None:
            try:
                document_type = DocumentType(payload.document_type)
            except ValueError as exc:
                raise ValidationAppException("Invalid document type") from exc

        with self.db.begin():
            traveler = Traveler(
                booking_id=booking.id,
                full_name=payload.full_name,
                traveler_type=traveler_type,
                date_of_birth=payload.date_of_birth,
                passport_number=payload.passport_number,
                nationality=payload.nationality,
                document_type=document_type,
            )
            self.booking_repo.add_traveler(traveler)

            self.audit_service.log_action(
                actor_type=LogActorType.user,
                actor_user_id=booking.user_id,
                action="traveler_added",
                resource_type="traveler",
                resource_id=traveler.id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    "booking_id": str(booking.id),
                    "traveler_type": traveler_type.value,
                    "full_name": payload.full_name,
                },
            )

        self.db.refresh(traveler)
        return traveler