import { useQuery, useMutation } from '../../hooks/useQuery'
import { hotelsApi } from './api'
import * as types from '../../types/api'

export function useSearchHotels(params: types.HotelSearchParams) {
  return useQuery<types.HotelSearchResponse>(
    `/hotels/search?city=${params.city}&check_in_date=${params.check_in_date}&check_out_date=${params.check_out_date}&room_count=${params.room_count}`
  )
}

export function useHotelById(id: string) {
  return useQuery<{ hotel: types.Hotel }>(`/hotels/${id}`)
}

export function useAvailableHotels() {
  return useQuery<types.HotelSearchResponse>('/hotels?limit=10&offset=0')
}
