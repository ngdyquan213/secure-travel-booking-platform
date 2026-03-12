from __future__ import annotations

from app.models.enums import BookingItemType
from app.repositories.flight_repository import FlightRepository
from app.repositories.hotel_repository import HotelRepository
from app.repositories.tour_repository import TourRepository


class BookingInventoryService:
    def __init__(
        self,
        flight_repo: FlightRepository,
        hotel_repo: HotelRepository,
        tour_repo: TourRepository,
    ) -> None:
        self.flight_repo = flight_repo
        self.hotel_repo = hotel_repo
        self.tour_repo = tour_repo

    def restore_inventory(self, booking) -> None:
        for item in booking.items:
            item_type = item.item_type.value if hasattr(item.item_type, "value") else str(item.item_type)

            if item_type == BookingItemType.flight.value and item.flight_id:
                flight = self.flight_repo.get_by_id_for_update(str(item.flight_id))
                if flight:
                    flight.available_seats += item.quantity
                    self.flight_repo.save(flight)

            elif item_type == BookingItemType.hotel.value and item.hotel_room_id:
                room = self.hotel_repo.get_room_by_id_for_update(str(item.hotel_room_id))
                if room:
                    room.total_rooms += item.quantity
                    self.hotel_repo.save_room(room)

            elif item_type == BookingItemType.tour.value and item.tour_schedule_id:
                schedule = self.tour_repo.get_schedule_by_id_for_update(str(item.tour_schedule_id))
                if schedule:
                    schedule.available_slots += item.quantity
                    self.tour_repo.save_schedule(schedule)