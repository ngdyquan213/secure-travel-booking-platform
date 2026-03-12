from app.core.exceptions import NotFoundAppException


class FlightService:
    def __init__(self, flight_repo):
        self.flight_repo = flight_repo

    def list_flights(
        self,
        skip: int = 0,
        limit: int = 20,
        departure_airport_code: str | None = None,
        arrival_airport_code: str | None = None,
        status: str | None = None,
        sort_by: str = "departure_time",
        sort_order: str = "asc",
    ):
        return self.flight_repo.list_flights(
            skip=skip,
            limit=limit,
            departure_airport_code=departure_airport_code,
            arrival_airport_code=arrival_airport_code,
            status=status,
            sort_by=sort_by,
            sort_order=sort_order,
        )

    def get_flight(self, flight_id: str):
        flight = self.flight_repo.get_by_id(flight_id)
        if not flight:
            raise NotFoundAppException("Flight not found")
        return flight