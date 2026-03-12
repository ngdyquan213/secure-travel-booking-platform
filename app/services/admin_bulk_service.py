from __future__ import annotations

from app.core.exceptions import NotFoundAppException
from app.models.enums import TourScheduleStatus
from app.repositories.coupon_repository import CouponRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.tour_repository import TourRepository
from app.services.admin_service import AdminService


class AdminBulkService:
    def __init__(
        self,
        coupon_repo: CouponRepository,
        tour_repo: TourRepository,
        payment_repo: PaymentRepository,
        admin_service: AdminService,
    ) -> None:
        self.coupon_repo = coupon_repo
        self.tour_repo = tour_repo
        self.payment_repo = payment_repo
        self.admin_service = admin_service

    def bulk_deactivate_coupons(self, coupon_ids: list[str]) -> list[dict]:
        results: list[dict] = []

        for coupon_id in coupon_ids:
            coupon = self.coupon_repo.get_by_id(coupon_id)
            if not coupon:
                results.append(
                    {"id": coupon_id, "success": False, "message": "Coupon not found"}
                )
                continue

            if not coupon.is_active:
                results.append(
                    {"id": coupon_id, "success": False, "message": "Coupon already inactive"}
                )
                continue

            coupon.is_active = False
            self.coupon_repo.save_coupon(coupon)
            results.append(
                {"id": coupon_id, "success": True, "message": "Coupon deactivated"}
            )

        return results

    def bulk_close_tour_schedules(self, schedule_ids: list[str]) -> list[dict]:
        results: list[dict] = []

        for schedule_id in schedule_ids:
            schedule = self.tour_repo.get_schedule_by_id(schedule_id)
            if not schedule:
                results.append(
                    {"id": schedule_id, "success": False, "message": "Tour schedule not found"}
                )
                continue

            current_status = (
                schedule.status.value if hasattr(schedule.status, "value") else str(schedule.status)
            )
            if current_status == TourScheduleStatus.closed.value:
                results.append(
                    {"id": schedule_id, "success": False, "message": "Tour schedule already closed"}
                )
                continue

            schedule.status = TourScheduleStatus.closed
            self.tour_repo.save_schedule(schedule)
            results.append(
                {"id": schedule_id, "success": True, "message": "Tour schedule closed"}
            )

        return results

    def bulk_update_refunds(
        self,
        *,
        refund_ids: list[str],
        status: str,
        reason: str | None = None,
    ) -> list[dict]:
        results: list[dict] = []

        for refund_id in refund_ids:
            try:
                self.admin_service.update_refund_status(
                    refund_id=refund_id,
                    new_status=status,
                    reason=reason,
                )
                results.append(
                    {"id": refund_id, "success": True, "message": f"Refund updated to {status}"}
                )
            except Exception as exc:
                results.append(
                    {"id": refund_id, "success": False, "message": str(exc)}
                )

        return results