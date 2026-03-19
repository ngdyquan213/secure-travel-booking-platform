import { http } from '../../services/http'

export const refundsAPI = {
  request: (bookingId: string, data: any) => http.post(`/bookings/${bookingId}/refund-request`, data),
  list: () => http.get('/refunds'),
  detail: (id: string) => http.get(`/refunds/${id}`),
  cancel: (id: string) => http.post(`/refunds/${id}/cancel`),
}
