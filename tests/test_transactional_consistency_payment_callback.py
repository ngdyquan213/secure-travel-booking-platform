from datetime import datetime, timedelta, timezone
from decimal import Decimal

from app.core.security import build_payment_callback_signature, get_password_hash
from app.models.booking import Booking, BookingItem
from app.models.enums import (
    BookingItemType,
    BookingStatus,
    PaymentStatus,
    UserStatus,
)
from app.models.flight import Airline, Airport, Flight
from app.models.user import User
from app.repositories.payment_repository import PaymentRepository


def create_user_and_login(client, db_session, *, email: str, username: str, password: str = "Password123"):
    user = User(
        email=email,
        username=username,
        full_name=username,
        password_hash=get_password_hash(password),
        status=UserStatus.active,
        email_verified=True,
        phone_verified=False,
        failed_login_count=0,
    )
    db_session.add(user)
    db_session.commit()

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login_resp.status_code == 200
    return user, login_resp.json()["access_token"]


def seed_booking_for_payment(db_session, user_id: str):
    airline = Airline(code="TC", name="Transactional Carrier")
    dep = Airport(code="TCA", name="A", city="HCM", country="VN")
    arr = Airport(code="TCB", name="B", city="HN", country="VN")
    db_session.add_all([airline, dep, arr])
    db_session.flush()

    flight = Flight(
        airline_id=airline.id,
        flight_number="TC100",
        departure_airport_id=dep.id,
        arrival_airport_id=arr.id,
        departure_time=datetime.now(timezone.utc) + timedelta(days=1),
        arrival_time=datetime.now(timezone.utc) + timedelta(days=1, hours=2),
        base_price=Decimal("1000000.00"),
        available_seats=10,
        status="scheduled",
    )
    db_session.add(flight)
    db_session.flush()

    booking = Booking(
        booking_code="BK-TX-PAY-001",
        user_id=user_id,
        status=BookingStatus.pending,
        total_base_amount=Decimal("1000000.00"),
        total_discount_amount=Decimal("0.00"),
        total_final_amount=Decimal("1000000.00"),
        currency="VND",
        payment_status=PaymentStatus.pending,
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
            unit_price=Decimal("1000000.00"),
            total_price=Decimal("1000000.00"),
        )
    )
    db_session.commit()
    return booking


def test_payment_callback_rolls_back_if_payment_save_fails(client, db_session, monkeypatch):
    user, token = create_user_and_login(
        client,
        db_session,
        email="tx-pay@example.com",
        username="tx_pay",
    )
    booking = seed_booking_for_payment(db_session, str(user.id))

    init_resp = client.post(
        "/api/v1/payments/initiate",
        json={"booking_id": str(booking.id), "payment_method": "vnpay"},
        headers={"Authorization": f"Bearer {token}", "Idempotency-Key": "tx-pay-001"},
    )
    assert init_resp.status_code in (200, 201)
    payment = init_resp.json()

    original_save = PaymentRepository.save

    def broken_save(self, payment_obj):
        raise RuntimeError("Simulated payment save failure")

    monkeypatch.setattr(PaymentRepository, "save", broken_save)

    payload = {
        "gateway_name": "vnpay",
        "gateway_order_ref": payment["gateway_order_ref"],
        "gateway_transaction_ref": "TXN-TX-ROLLBACK-001",
        "amount": "1000000.00",
        "currency": "VND",
        "status": "paid",
    }
    payload["signature"] = build_payment_callback_signature(**payload)

    resp = client.post("/api/v1/payments/callback", json=payload)
    assert resp.status_code == 500

    refreshed_booking = db_session.query(Booking).filter(Booking.id == booking.id).first()
    assert (
        refreshed_booking.payment_status.value
        if hasattr(refreshed_booking.payment_status, "value")
        else str(refreshed_booking.payment_status)
    ) == "pending"

    monkeypatch.setattr(PaymentRepository, "save", original_save)