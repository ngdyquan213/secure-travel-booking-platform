from app.core.exceptions import NotFoundAppException


class HotelService:
    def __init__(self, hotel_repo):
        self.hotel_repo = hotel_repo

    def list_hotels(
        self,
        skip: int = 0,
        limit: int = 20,
        city: str | None = None,
        country: str | None = None,
        min_star_rating: int | None = None,
        sort_by: str = "name",
        sort_order: str = "asc",
    ):
        return self.hotel_repo.list_hotels(
            skip=skip,
            limit=limit,
            city=city,
            country=country,
            min_star_rating=min_star_rating,
            sort_by=sort_by,
            sort_order=sort_order,
        )

    def get_hotel(self, hotel_id: str):
        hotel = self.hotel_repo.get_by_id(hotel_id)
        if not hotel:
            raise NotFoundAppException("Hotel not found")
        return hotel