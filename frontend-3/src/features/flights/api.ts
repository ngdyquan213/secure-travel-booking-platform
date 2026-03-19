import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const flightsApi = {
  search: async (params: types.FlightSearchParams): Promise<types.FlightSearchResponse> => {
    return httpClient.get('/flights/search', { params })
  },

  getFlightById: async (id: string): Promise<{ flight: types.Flight }> => {
    return httpClient.get(`/flights/${id}`)
  },

  getAvailableFlights: async (limit = 10, offset = 0): Promise<types.FlightSearchResponse> => {
    return httpClient.get('/flights', { params: { limit, offset } })
  },

  getFlightDetails: async (id: string): Promise<{ flight: types.Flight }> => {
    return httpClient.get(`/flights/${id}`)
  },
}
