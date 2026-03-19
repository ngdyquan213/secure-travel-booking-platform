import { useQuery, useMutation } from '../../hooks/useQuery'
import { paymentsApi } from './api'
import * as types from '../../types/api'

export function useInitiatePayment() {
  return useMutation<
    types.InitiatePaymentResponse,
    { bookingId: string; paymentMethod: string }
  >(({ bookingId, paymentMethod }) => paymentsApi.initiatePayment(bookingId, paymentMethod))
}

export function useConfirmPayment() {
  return useMutation<{ payment: types.Payment }, string>(
    (paymentId) => paymentsApi.confirmPayment(paymentId)
  )
}

export function usePaymentById(id: string) {
  return useQuery<{ payment: types.Payment }>(`/payments/${id}`)
}
