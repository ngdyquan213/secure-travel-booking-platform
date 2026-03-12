from __future__ import annotations

from app.repositories.admin_dashboard_repository import AdminDashboardRepository


class AdminDashboardService:
    def __init__(self, dashboard_repo: AdminDashboardRepository) -> None:
        self.dashboard_repo = dashboard_repo

    def get_dashboard_summary(self, recent_limit: int = 10) -> dict:
        return {
            "booking_status_counts": self.dashboard_repo.get_booking_status_counts(),
            "payment_status_counts": self.dashboard_repo.get_payment_status_counts(),
            "refund_status_counts": self.dashboard_repo.get_refund_status_counts(),
            "revenue": self.dashboard_repo.get_revenue_summary(),
            "recent_activities": self.dashboard_repo.get_recent_activities(limit=recent_limit),
        }