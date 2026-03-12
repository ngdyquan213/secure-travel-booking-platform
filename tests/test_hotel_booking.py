from datetime import date
from decimal import Decimal

from app.core.security import get_password_hash
from app.models.enums import UserStatus
from app.models.hotel import Hotel, HotelRoom
from app.models.user import User


def create_user_and_login(client, db_session, email: str, username: str):
    user = User(
        email=email,
        username=username,
        full_name=username,
        password_hash=get_password_hash("Password123"),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    db_session.add(user)
    db_session.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "Password123"},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return user, token


def seed_hotel_room(db_session):
    hotel = Hotel(
        name="Test Hotel",
        city="Ho Chi Minh City",
        country="Vietnam",
        star_rating=4,
        description="Test Hotel Description",
    )
    db_session.add(hotel)
    db_session.flush()

    room = HotelRoom(
        hotel_id=hotel.id,
        room_type="Deluxe",
        capacity=2,
        base_price_per_night=Decimal("1200000.00"),
        total_rooms=5,
    )
    db_session.add(room)
    db_session.commit()
    return room


def test_create_hotel_booking_success(client, db_session):
    _, token = create_user_and_login(
        client,
        db_session,
        "hotelbooking@example.com",
        "hotel_booking_user",
    )
    room = seed_hotel_room(db_session)

    resp = client.post(
        "/api/v1/bookings/hotels",
        json={
            "hotel_room_id": str(room.id),
            "check_in_date": date.today().isoformat(),
            "check_out_date": date.fromordinal(date.today().toordinal() + 2).isoformat(),
            "quantity": 1,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 201
    body = resp.json()
    assert body["status"] == "pending"
    assert body["currency"] == "VND"

    db_session.refresh(room)
    assert room.total_rooms == 4


def test_hotel_booking_invalid_date_range(client, db_session):
    _, token = create_user_and_login(
        client,
        db_session,
        "hotelbooking2@example.com",
        "hotel_booking_user_2",
    )
    room = seed_hotel_room(db_session)

    resp = client.post(
        "/api/v1/bookings/hotels",
        json={
            "hotel_room_id": str(room.id),
            "check_in_date": "2026-01-10",
            "check_out_date": "2026-01-10",
            "quantity": 1,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 422


def test_hotel_booking_not_enough_rooms(client, db_session):
    _, token = create_user_and_login(
        client,
        db_session,
        "hotelbooking3@example.com",
        "hotel_booking_user_3",
    )
    room = seed_hotel_room(db_session)

    resp = client.post(
        "/api/v1/bookings/hotels",
        json={
            "hotel_room_id": str(room.id),
            "check_in_date": "2026-01-10",
            "check_out_date": "2026-01-12",
            "quantity": 10,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 400
    assert resp.json()["detail"] == "Not enough available rooms"