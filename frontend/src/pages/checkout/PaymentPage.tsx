import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, CreditCard, Landmark, Wallet } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, generateIdempotencyKey } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

const paymentMethods = [
  { id: 'vnpay', label: 'VNPay', description: 'Popular local gateway for travel purchases.', icon: Landmark },
  { id: 'momo', label: 'MoMo', description: 'Mobile wallet flow with fast confirmation.', icon: Wallet },
  { id: 'stripe', label: 'Stripe', description: 'International card processing.', icon: CreditCard },
]

export function PaymentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('vnpay')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(10, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load booking information.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const booking = useMemo(() => {
    const bookingId = searchParams.get('bookingId')
    return bookings.find((item) => item.id === bookingId) ?? bookings[0] ?? null
  }, [bookings, searchParams])

  const handlePayment = async () => {
    if (!booking) return

    setSubmitting(true)
    setError('')

    try {
      const payment = await apiClient.initiatePayment({
        booking_id: booking.id,
        payment_method: selectedMethod,
        idempotency_key: generateIdempotencyKey(),
      })

      navigate(`/checkout/success?bookingId=${booking.id}&paymentId=${payment.payment_id}`, {
        replace: true,
      })
    } catch (paymentError) {
      const message = paymentError instanceof Error ? paymentError.message : 'Payment initiation failed.'
      navigate(`/checkout/failed?bookingId=${booking.id}&message=${encodeURIComponent(message)}`, {
        replace: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Preparing your payment request...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        No booking was found for payment. Return to checkout and select a booking first.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Payment</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Choose a payment method</h1>
        <p className="mt-2 text-gray-600">
          Your booking total is {formatCurrency(booking.total_price, booking.currency ?? 'USD')}.
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedMethod(id)}
            className={`rounded-3xl border p-5 text-left transition ${
              selectedMethod === id
                ? 'border-primary-600 bg-primary-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-primary-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{label}</h2>
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                </div>
              </div>
              {selectedMethod === id && <CheckCircle2 className="h-5 w-5 text-primary-600" />}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5 text-sm text-gray-600">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
          <p>
            Payment requests are created once per action using a fresh idempotency key to reduce accidental duplicates.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handlePayment()}
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Starting payment...' : 'Initiate payment'}
      </button>
    </div>
  )
}
