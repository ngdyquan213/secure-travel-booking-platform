from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.coupon_repository import CouponRepository
from app.schemas.coupon import CouponApplyRequest, CouponApplyResponse
from app.services.audit_service import AuditService
from app.services.coupon_service import CouponService

router = APIRouter(prefix="/coupons", tags=["coupons"])


@router.post("/apply", response_model=CouponApplyResponse)
def apply_coupon(
    payload: CouponApplyRequest,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CouponApplyResponse:
    audit_service = AuditService(AuditRepository(db))
    service = CouponService(
        db=db,
        booking_repo=BookingRepository(db),
        coupon_repo=CouponRepository(db),
        audit_service=audit_service,
    )

    booking, coupon = service.apply_coupon(
        user_id=str(current_user.id),
        payload=payload,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return CouponApplyResponse(
        booking_id=str(booking.id),
        booking_code=booking.booking_code,
        coupon_id=str(coupon.id),
        coupon_code=coupon.code,
        coupon_name=coupon.name,
        applicable_product_type=(
            coupon.applicable_product_type.value
            if hasattr(coupon.applicable_product_type, "value")
            else str(coupon.applicable_product_type)
        ),
        total_base_amount=booking.total_base_amount,
        total_discount_amount=booking.total_discount_amount,
        total_final_amount=booking.total_final_amount,
        currency=booking.currency,
    )