from datetime import datetime, timedelta, timezone
from decimal import Decimal

import pytest

from app.core.security import get_password_hash
from app.models.booking import Booking, BookingItem
from app.models.coupon import Coupon
from app.models.enums import (
    BookingItemType,
    BookingStatus,
    CouponApplicableProductType,
    CouponType,
    PaymentStatus,
    UserStatus,
)
from app.models.user import User
from app.repositories.coupon_repository import CouponRepository


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


def seed_tour_booking_and_coupon(db_session, user_id: str):
    booking = Booking(
        booking_code="BK-TX-COUPON-001",
        user_id=user_id,
        status=BookingStatus.pending,
        total_base_amount=Decimal("2000000.00"),
        total_discount_amount=Decimal("0.00"),
        total_final_amount=Decimal("2000000.00"),
        currency="VND",
        payment_status=PaymentStatus.pending,
        booked_at=datetime.now(timezone.utc),
    )
    db_session.add(booking)
    db_session.flush()

    item = BookingItem(
        booking_id=booking.id,
        item_type=BookingItemType.tour,
        quantity=2,
        unit_price=Decimal("1000000.00"),
        total_price=Decimal("2000000.00"),
        metadata_json={"adult_count": 2, "child_count": 0, "infant_count": 0},
    )
    db_session.add(item)

    coupon = Coupon(
        code="TXTOUR",
        name="Transactional Tour Coupon",
        coupon_type=CouponType.fixed_amount,
        applicable_product_type=CouponApplicableProductType.tour,
        discount_value=Decimal("100000.00"),
        max_discount_amount=None,
        min_booking_amount=Decimal("500000.00"),
        usage_limit_total=100,
        usage_limit_per_user=1,
        used_count=0,
        starts_at=datetime.now(timezone.utc) - timedelta(days=1),
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        is_active=True,
    )
    db_session.add(coupon)
    db_session.commit()

    return booking, coupon


def test_coupon_apply_rolls_back_if_usage_insert_fails(client, db_session, monkeypatch):
    from app.api.v1 import coupons as coupons_api

    user, token = create_user_and_login(
        client,
        db_session,
        email="tx-coupon@example.com",
        username="tx_coupon",
    )
    booking, coupon = seed_tour_booking_and_coupon(db_session, str(user.id))

    original_add_usage = CouponRepository.add_usage

    def broken_add_usage(self, usage):
        raise RuntimeError("Simulated usage insert failure")

    monkeypatch.setattr(CouponRepository, "add_usage", broken_add_usage)

    resp = client.post(
        "/api/v1/coupons/apply",
        json={"booking_id": str(booking.id), "coupon_code": coupon.code},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 500

    refreshed_booking = db_session.query(Booking).filter(Booking.id == booking.id).first()
    refreshed_coupon = db_session.query(Coupon).filter(Coupon.id == coupon.id).first()

    assert refreshed_booking.coupon_id is None
    assert Decimal(refreshed_booking.total_discount_amount) == Decimal("0.00")
    assert Decimal(refreshed_booking.total_final_amount) == Decimal("2000000.00")
    assert refreshed_coupon.used_count == 0

    monkeypatch.setattr(CouponRepository, "add_usage", original_add_usage)