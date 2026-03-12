from sqlalchemy import asc, desc
from sqlalchemy.orm import Session, joinedload

from app.models.hotel import Hotel, HotelRoom


class HotelRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_hotels(
        self,
        skip: int = 0,
        limit: int = 20,
        city: str | None = None,
        country: str | None = None,
        min_star_rating: int | None = None,
        sort_by: str = "name",
        sort_order: str = "asc",
    ) -> list[Hotel]:
        query = self.db.query(Hotel).options(joinedload(Hotel.rooms))

        if city:
            query = query.filter(Hotel.city.ilike(f"%{city}%"))

        if country:
            query = query.filter(Hotel.country.ilike(f"%{country}%"))

        if min_star_rating is not None:
            query = query.filter(Hotel.star_rating >= min_star_rating)

        sort_column = {
            "name": Hotel.name,
            "city": Hotel.city,
            "star_rating": Hotel.star_rating,
        }.get(sort_by, Hotel.name)

        order_clause = asc(sort_column) if sort_order == "asc" else desc(sort_column)

        return query.order_by(order_clause).offset(skip).limit(limit).all()

    def count_hotels(
        self,
        city: str | None = None,
        country: str | None = None,
        min_star_rating: int | None = None,
    ) -> int:
        query = self.db.query(Hotel)

        if city:
            query = query.filter(Hotel.city.ilike(f"%{city}%"))

        if country:
            query = query.filter(Hotel.country.ilike(f"%{country}%"))

        if min_star_rating is not None:
            query = query.filter(Hotel.star_rating >= min_star_rating)

        return query.count()

    def get_by_id(self, hotel_id: str) -> Hotel | None:
        return (
            self.db.query(Hotel)
            .options(joinedload(Hotel.rooms))
            .filter(Hotel.id == hotel_id)
            .first()
        )

    def get_room_by_id(self, room_id: str) -> HotelRoom | None:
        return self.db.query(HotelRoom).filter(HotelRoom.id == room_id).first()

    def get_room_by_id_for_update(self, room_id: str) -> HotelRoom | None:
        return (
            self.db.query(HotelRoom)
            .filter(HotelRoom.id == room_id)
            .with_for_update()
            .first()
        )

    def save_room(self, room: HotelRoom) -> HotelRoom:
        self.db.add(room)
        self.db.flush()
        return room