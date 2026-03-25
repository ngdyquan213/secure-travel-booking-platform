import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ReceiptText } from 'lucide-react'

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const paymentId = searchParams.get('paymentId')

  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <BadgeCheck className="h-10 w-10 text-emerald-600" />
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Payment started</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Your payment request was created successfully</h1>
        <p className="mt-3 text-gray-600">
          Keep the references below for audit trails, reconciliation, or support follow-up.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Booking ID</p>
          <p className="mt-2 break-all font-semibold text-gray-900">{bookingId ?? 'Unavailable'}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Payment ID</p>
          <p className="mt-2 break-all font-semibold text-gray-900">{paymentId ?? 'Unavailable'}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/account/bookings"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          View my bookings
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/account/documents"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition hover:border-gray-400"
        >
          <ReceiptText className="h-4 w-4" />
          Review documents
        </Link>
      </div>
    </div>
  )
}
