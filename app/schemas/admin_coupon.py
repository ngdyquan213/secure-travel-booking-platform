from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class AdminCouponCreateRequest(BaseModel):
    code: str
    name: str
    coupon_type: str
    applicable_product_type: str = "all"
    discount_value: Decimal
    max_discount_amount: Decimal | None = None
    min_booking_amount: Decimal = Decimal("0")
    usage_limit_total: int | None = None
    usage_limit_per_user: int | None = None
    starts_at: datetime | None = None
    expires_at: datetime | None = None
    is_active: bool = True


class AdminCouponUpdateRequest(BaseModel):
    name: str | None = None
    applicable_product_type: str | None = None
    discount_value: Decimal | None = None
    max_discount_amount: Decimal | None = None
    min_booking_amount: Decimal | None = None
    usage_limit_total: int | None = None
    usage_limit_per_user: int | None = None
    starts_at: datetime | None = None
    expires_at: datetime | None = None
    is_active: bool | None = None


class AdminCouponResponse(BaseModel):
    id: str
    code: str
    name: str
    coupon_type: str
    applicable_product_type: str
    discount_value: Decimal
    max_discount_amount: Decimal | None = None
    min_booking_amount: Decimal
    usage_limit_total: int | None = None
    usage_limit_per_user: int | None = None
    used_count: int
    is_active: bool