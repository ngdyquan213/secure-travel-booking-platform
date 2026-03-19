import { http } from '../../services/http'

export const couponsAPI = {
  validate: (code: string) => http.post('/coupons/validate', { code }),
  list: () => http.get('/coupons'),
  apply: (bookingId: string, code: string) => http.post(`/bookings/${bookingId}/apply-coupon`, { code }),
}
