from __future__ import annotations

import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.booking import BookingItem


class Hotel(Base, TimestampMixin):
    __tablename__ = "hotels"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    star_rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    rooms: Mapped[list[HotelRoom]] = relationship(
        "HotelRoom",
        back_populates="hotel",
        cascade="all, delete-orphan",
    )


class HotelRoom(Base, TimestampMixin):
    __tablename__ = "hotel_rooms"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hotel_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("hotels.id", ondelete="CASCADE"),
        nullable=False,
    )
    room_type: Mapped[str] = mapped_column(String(100), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    base_price_per_night: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_rooms: Mapped[int] = mapped_column(Integer, nullable=False)

    hotel: Mapped[Hotel] = relationship("Hotel", back_populates="rooms")
    booking_items: Mapped[list[BookingItem]] = relationship("BookingItem", back_populates="hotel_room")