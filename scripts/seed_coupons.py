from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.coupon import Coupon
from app.models.enums import CouponApplicableProductType, CouponType


def main() -> None:
    db: Session = SessionLocal()

    try:
        with db.begin():
            coupons = [
                {
                    "code": "WELCOME10",
                    "name": "Welcome 10%",
                    "coupon_type": CouponType.percentage,
                    "applicable_product_type": CouponApplicableProductType.all,
                    "discount_value": Decimal("10"),
                    "max_discount_amount": Decimal("300000"),
                    "min_booking_amount": Decimal("500000"),
                    "usage_limit_total": 1000,
                    "usage_limit_per_user": 1,
                    "starts_at": datetime.now(timezone.utc) - timedelta(days=1),
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=90),
                    "is_active": True,
                },
                {
                    "code": "FLIGHT200K",
                    "name": "Flight Flat 200K",
                    "coupon_type": CouponType.fixed_amount,
                    "applicable_product_type": CouponApplicableProductType.flight,
                    "discount_value": Decimal("200000"),
                    "max_discount_amount": None,
                    "min_booking_amount": Decimal("1000000"),
                    "usage_limit_total": 500,
                    "usage_limit_per_user": 2,
                    "starts_at": datetime.now(timezone.utc) - timedelta(days=1),
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=60),
                    "is_active": True,
                },
                {
                    "code": "HOTEL15",
                    "name": "Hotel 15%",
                    "coupon_type": CouponType.percentage,
                    "applicable_product_type": CouponApplicableProductType.hotel,
                    "discount_value": Decimal("15"),
                    "max_discount_amount": Decimal("400000"),
                    "min_booking_amount": Decimal("800000"),
                    "usage_limit_total": 300,
                    "usage_limit_per_user": 1,
                    "starts_at": datetime.now(timezone.utc) - timedelta(days=1),
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=60),
                    "is_active": True,
                },
                {
                    "code": "TOUR300K",
                    "name": "Tour Flat 300K",
                    "coupon_type": CouponType.fixed_amount,
                    "applicable_product_type": CouponApplicableProductType.tour,
                    "discount_value": Decimal("300000"),
                    "max_discount_amount": None,
                    "min_booking_amount": Decimal("2000000"),
                    "usage_limit_total": 200,
                    "usage_limit_per_user": 1,
                    "starts_at": datetime.now(timezone.utc) - timedelta(days=1),
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=60),
                    "is_active": True,
                },
            ]

            for item in coupons:
                exists = db.query(Coupon).filter(Coupon.code == item["code"]).first()
                if exists:
                    continue

                db.add(Coupon(**item))

        print("Coupons seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()