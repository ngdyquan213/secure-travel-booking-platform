import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, LifeBuoy } from 'lucide-react'

export function PaymentFailedPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const message = searchParams.get('message')

  return (
    <div className="space-y-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Payment issue</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">We could not complete the payment setup</h1>
        <p className="mt-3 text-gray-600">
          {message ?? 'The payment provider rejected the request or the API returned an error.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Booking reference</p>
          <p className="mt-2 break-all font-semibold text-gray-900">{bookingId ?? 'Unavailable'}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Suggested action</p>
          <p className="mt-2 font-semibold text-gray-900">Retry with a different payment method or contact support.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={bookingId ? `/checkout/payment?bookingId=${bookingId}` : '/checkout'}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Retry payment
        </Link>
        <Link
          to="/account/support"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition hover:border-gray-400"
        >
          <LifeBuoy className="h-4 w-4" />
          Contact support
        </Link>
        <Link to="/checkout" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" />
          Back to checkout
        </Link>
      </div>
    </div>
  )
}
