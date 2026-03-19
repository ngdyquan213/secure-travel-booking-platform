import { useQuery, useMutation } from '../../hooks/useQuery'
import { flightsApi } from './api'
import * as types from '../../types/api'

export function useSearchFlights(params: types.FlightSearchParams) {
  return useQuery<types.FlightSearchResponse>(
    `/flights/search?departure_airport=${params.departure_airport}&arrival_airport=${params.arrival_airport}&departure_date=${params.departure_date}&passenger_count=${params.passenger_count}`
  )
}

export function useFlightById(id: string) {
  return useQuery<{ flight: types.Flight }>(`/flights/${id}`)
}

export function useAvailableFlights() {
  return useQuery<types.FlightSearchResponse>('/flights?limit=10&offset=0')
}
