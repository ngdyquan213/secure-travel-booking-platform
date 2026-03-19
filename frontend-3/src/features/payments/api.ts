import { httpClient } from '../../services/http'
import * as types from '../../types/api'
import { v4 as uuidv4 } from 'uuid'

export const paymentsApi = {
  initiatePayment: async (
    bookingId: string,
    paymentMethod: string
  ): Promise<types.InitiatePaymentResponse> => {
    const idempotencyKey = uuidv4()
    return httpClient.post(
      '/payments/initiate',
      {
        booking_id: bookingId,
        payment_method: paymentMethod,
        idempotency_key: idempotencyKey,
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    )
  },

  getPayment: async (id: string): Promise<{ payment: types.Payment }> => {
    return httpClient.get(`/payments/${id}`)
  },

  confirmPayment: async (paymentId: string): Promise<{ payment: types.Payment }> => {
    return httpClient.post(`/payments/${paymentId}/confirm`, {})
  },

  getPaymentMethods: async (): Promise<any[]> => {
    return httpClient.get('/payments/methods')
  },

  addPaymentMethod: async (data: any): Promise<any> => {
    return httpClient.post('/payments/methods', data)
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    return httpClient.delete(`/payments/methods/${id}`)
  },
}
