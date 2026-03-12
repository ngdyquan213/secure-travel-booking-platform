from app.core.exceptions import NotFoundAppException


class TourService:
    def __init__(self, tour_repo):
        self.tour_repo = tour_repo

    def list_tours(
        self,
        skip: int = 0,
        limit: int = 20,
        destination: str | None = None,
        status: str | None = None,
        tour_type: str | None = None,
        sort_by: str = "name",
        sort_order: str = "asc",
    ):
        return self.tour_repo.list_tours(
            skip=skip,
            limit=limit,
            destination=destination,
            status=status,
            tour_type=tour_type,
            sort_by=sort_by,
            sort_order=sort_order,
        )

    def get_tour(self, tour_id: str):
        tour = self.tour_repo.get_by_id(tour_id)
        if not tour:
            raise NotFoundAppException("Tour not found")
        return tour