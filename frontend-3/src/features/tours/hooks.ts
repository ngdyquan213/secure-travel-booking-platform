import { useQuery, useMutation } from '../../hooks/useQuery'
import { toursApi } from './api'
import * as types from '../../types/api'

export function useSearchTours(params?: types.TourSearchParams) {
  const queryString = params?.destination
    ? `/tours/search?destination=${params.destination}`
    : '/tours/search'
  return useQuery<types.TourSearchResponse>(queryString)
}

export function useTourById(id: string) {
  return useQuery<{ tour: types.Tour }>(`/tours/${id}`)
}

export function useAvailableTours() {
  return useQuery<types.TourSearchResponse>('/tours?limit=10&offset=0')
}
