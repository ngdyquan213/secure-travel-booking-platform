import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Calendar, CreditCard, Receipt, Users } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(10, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load booking data.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const selectedBooking = useMemo(() => {
    const requestedBookingId = searchParams.get('bookingId')
    return (
      bookings.find((booking) => booking.id === requestedBookingId) ??
      bookings.find((booking) => booking.booking_status === 'PENDING') ??
      bookings[0] ??
      null
    )
  }, [bookings, searchParams])

  const handleContinue = () => {
    if (!selectedBooking) return
    navigate(`/checkout/payment?bookingId=${selectedBooking.id}`)
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading checkout information...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  if (!selectedBooking) {
    return (
      <div className="space-y-4 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">No booking is ready for checkout</h1>
        <p className="text-gray-600">Create a booking first, then return here to review and pay securely.</p>
        <Link to="/tours" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700">
          Browse tours
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Checkout review</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Confirm your booking details</h1>
        <p className="mt-2 text-gray-600">Review the current booking before continuing to payment.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm text-gray-500">Booking code</p>
              <h2 className="text-2xl font-bold text-gray-900">{selectedBooking.booking_code ?? selectedBooking.id.slice(0, 8)}</h2>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
              {selectedBooking.booking_status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Booking type</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{selectedBooking.booking_type}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Payment status</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{selectedBooking.payment_status}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Travel date
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(selectedBooking.travel_date)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                Travelers
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{selectedBooking.number_of_travelers}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-gray-200 bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Amount due</p>
          <p className="mt-4 text-4xl font-bold">{formatCurrency(selectedBooking.total_price, selectedBooking.currency ?? 'USD')}</p>
          <p className="mt-3 text-sm text-slate-300">
            Payment requests are created with an idempotency key to reduce duplicate charge risk.
          </p>

          <button
            type="button"
            onClick={handleContinue}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Continue to payment
            <CreditCard className="h-4 w-4" />
          </button>
        </aside>
      </div>
    </div>
  )
}
