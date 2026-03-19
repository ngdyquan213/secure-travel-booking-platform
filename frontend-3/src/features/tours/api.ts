import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const toursApi = {
  search: async (params: types.TourSearchParams): Promise<types.TourSearchResponse> => {
    return httpClient.get('/tours/search', { params })
  },

  getTourById: async (id: string): Promise<{ tour: types.Tour }> => {
    return httpClient.get(`/tours/${id}`)
  },

  getAvailableTours: async (limit = 10, offset = 0): Promise<types.TourSearchResponse> => {
    return httpClient.get('/tours', { params: { limit, offset } })
  },

  getTourDetails: async (id: string): Promise<{ tour: types.Tour }> => {
    return httpClient.get(`/tours/${id}`)
  },

  getTourItinerary: async (id: string): Promise<any> => {
    return httpClient.get(`/tours/${id}/itinerary`)
  },
}
