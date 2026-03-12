from datetime import datetime, timedelta, timezone
from decimal import Decimal

from app.core.security import get_password_hash
from app.models.booking import Booking, BookingItem
from app.models.enums import (
    BookingItemType,
    BookingStatus,
    PaymentMethod,
    PaymentStatus,
    TourScheduleStatus,
    TourStatus,
    TravelerType,
    UserStatus,
)
from app.models.flight import Airline, Airport, Flight
from app.models.payment import Payment
from app.models.tour import Tour, TourPriceRule, TourSchedule
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
    return user, resp.json()["access_token"]


def seed_flight_booking_with_payment(db_session, user_id: str):
    airline = Airline(code="RC", name="Refund Carrier")
    dep = Airport(code="RCA", name="A", city="A", country="VN")
    arr = Airport(code="RCB", name="B", city="B", country="VN")
    db_session.add_all([airline, dep, arr])
    db_session.flush()

    flight = Flight(
        airline_id=airline.id,
        flight_number="RC100",
        departure_airport_id=dep.id,
        arrival_airport_id=arr.id,
        departure_time=datetime.now(timezone.utc) + timedelta(days=1),
        arrival_time=datetime.now(timezone.utc) + timedelta(days=1, hours=2),
        base_price=Decimal("1200000.00"),
        available_seats=10,
        status="scheduled",
    )
    db_session.add(flight)
    db_session.flush()

    booking = Booking(
        booking_code="BK-CANCEL-FLIGHT",
        user_id=user_id,
        status=BookingStatus.pending,
        total_base_amount=Decimal("1200000.00"),
        total_discount_amount=Decimal("0.00"),
        total_final_amount=Decimal("1200000.00"),
        currency="VND",
        payment_status=PaymentStatus.paid,
        booked_at=datetime.now(timezone.utc),
    )
    db_session.add(booking)
    db_session.flush()

    db_session.add(
        BookingItem(
            booking_id=booking.id,
            item_type=BookingItemType.flight,
            flight_id=flight.id,
            quantity=1,
            unit_price=Decimal("1200000.00"),
            total_price=Decimal("1200000.00"),
        )
    )
    db_session.flush()

    payment = Payment(
        booking_id=booking.id,
        initiated_by=user_id,
        payment_method=PaymentMethod.vnpay,
        status=PaymentStatus.paid,
        amount=Decimal("1200000.00"),
        currency="VND",
        gateway_order_ref="ORDER-CANCEL-001",
        gateway_transaction_ref="TXN-CANCEL-001",
        paid_at=datetime.now(timezone.utc),
    )
    db_session.add(payment)
    db_session.commit()

    return booking


def seed_tour_booking_pending_payment(db_session, user_id: str):
    tour = Tour(
        code="CANCEL-TOUR-001",
        name="Cancel Tour",
        destination="Da Nang",
        description="Cancellation test tour",
        duration_days=3,
        duration_nights=2,
        meeting_point="Airport",
        tour_type="domestic",
        status=TourStatus.active,
    )
    db_session.add(tour)
    db_session.flush()

    schedule = TourSchedule(
        tour_id=tour.id,
        departure_date=datetime.now(timezone.utc).date() + timedelta(days=7),
        return_date=datetime.now(timezone.utc).date() + timedelta(days=9),
        capacity=10,
        available_slots=8,
        status=TourScheduleStatus.scheduled,
    )
    db_session.add(schedule)
    db_session.flush()

    db_session.add_all(
        [
            TourPriceRule(
                tour_schedule_id=schedule.id,
                traveler_type=TravelerType.adult,
                price=Decimal("3000000.00"),
                currency="VND",
            ),
            TourPriceRule(
                tour_schedule_id=schedule.id,
                traveler_type=TravelerType.child,
                price=Decimal("2000000.00"),
                currency="VND",
            ),
        ]
    )
    db_session.flush()

    booking = Booking(
        booking_code="BK-CANCEL-TOUR",
        user_id=user_id,
        status=BookingStatus.pending,
        total_base_amount=Decimal("3000000.00"),
        total_discount_amount=Decimal("0.00"),
        total_final_amount=Decimal("3000000.00"),
        currency="VND",
        payment_status=PaymentStatus.pending,
        booked_at=datetime.now(timezone.utc),
    )
    db_session.add(booking)
    db_session.flush()

    db_session.add(
        BookingItem(
            booking_id=booking.id,
            item_type=BookingItemType.tour,
            tour_schedule_id=schedule.id,
            quantity=2,
            unit_price=Decimal("1500000.00"),
            total_price=Decimal("3000000.00"),
            metadata_json={"adult_count": 2, "child_count": 0, "infant_count": 0},
        )
    )
    db_session.flush()

    payment = Payment(
        booking_id=booking.id,
        initiated_by=user_id,
        payment_method=PaymentMethod.vnpay,
        status=PaymentStatus.pending,
        amount=Decimal("3000000.00"),
        currency="VND",
        gateway_order_ref="ORDER-CANCEL-TOUR-001",
    )
    db_session.add(payment)
    db_session.commit()

    return booking, schedule


def test_cancel_paid_flight_booking_creates_refund(client, db_session):
    user, token = create_user_and_login(client, db_session, "cancel1@example.com", "cancel1")
    booking = seed_flight_booking_with_payment(db_session, str(user.id))

    resp = client.post(
        f"/api/v1/bookings/{booking.id}/cancel",
        json={"reason": "Change of plan"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "cancelled"
    assert body["payment_status"] == "refunded"
    assert body["refund_amount"] == "1200000.00"
    assert body["refund_status"] == "processed"


def test_cancel_pending_tour_booking_cancels_payment_no_refund(client, db_session):
    user, token = create_user_and_login(client, db_session, "cancel2@example.com", "cancel2")
    booking, _ = seed_tour_booking_pending_payment(db_session, str(user.id))

    resp = client.post(
        f"/api/v1/bookings/{booking.id}/cancel",
        json={"reason": "Cannot join"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "cancelled"
    assert body["payment_status"] == "cancelled"
    assert body["refund_amount"] == "0"