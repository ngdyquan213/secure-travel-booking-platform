import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const hotelsApi = {
  search: async (params: types.HotelSearchParams): Promise<types.HotelSearchResponse> => {
    return httpClient.get('/hotels/search', { params })
  },

  getHotelById: async (id: string): Promise<{ hotel: types.Hotel }> => {
    return httpClient.get(`/hotels/${id}`)
  },

  getAvailableHotels: async (limit = 10, offset = 0): Promise<types.HotelSearchResponse> => {
    return httpClient.get('/hotels', { params: { limit, offset } })
  },

  getHotelDetails: async (id: string): Promise<{ hotel: types.Hotel }> => {
    return httpClient.get(`/hotels/${id}`)
  },

  getHotelReviews: async (hotelId: string): Promise<any[]> => {
    return httpClient.get(`/hotels/${hotelId}/reviews`)
  },
}
