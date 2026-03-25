import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Route } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Tour } from '@/shared/types/api'

export function TourDetailPage() {
  const { id } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTour = async () => {
      if (!id) {
        setError('Missing tour id.')
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.getTourById(id)
        setTour(response)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this tour.')
      } finally {
        setLoading(false)
      }
    }

    void loadTour()
  }, [id])

  if (loading) {
    return <div className="container-custom py-16 text-center text-gray-600">Loading tour detail...</div>
  }

  if (error || !tour) {
    return <div className="container-custom py-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'Tour not found.'}</div>
  }

  const firstSchedule = tour.schedules?.[0]
  const basePrice = firstSchedule?.price_rules?.[0]

  return (
    <div className="container-custom py-12 space-y-8">
      <section className="rounded-[32px] bg-slate-950 px-8 py-10 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{tour.code ?? 'Tour detail'}</p>
        <h1 className="mt-3 text-4xl font-bold">{tour.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {tour.destination}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {tour.duration_days} days / {tour.duration_nights ?? Math.max(tour.duration_days - 1, 0)} nights
          </span>
          {tour.tour_type && <span>{tour.tour_type}</span>}
        </div>
        <p className="mt-6 max-w-3xl text-slate-200">{tour.description || 'A guided trip curated for travelers who want structure without losing flexibility.'}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Itinerary highlights</h2>
            <div className="mt-5 space-y-4">
              {tour.itineraries && tour.itineraries.length > 0 ? (
                tour.itineraries.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-primary-600">Day {item.day_number}</p>
                    <h3 className="mt-1 font-semibold text-gray-900">{item.title}</h3>
                    {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Detailed itinerary blocks will appear here when provided by operations.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Policies</h2>
            <div className="mt-5 space-y-4">
              {tour.policies && tour.policies.length > 0 ? (
                tour.policies.map((policy) => (
                  <div key={policy.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-600">
                    {policy.cancellation_policy && <p><span className="font-semibold text-gray-900">Cancellation:</span> {policy.cancellation_policy}</p>}
                    {policy.refund_policy && <p className="mt-2"><span className="font-semibold text-gray-900">Refund:</span> {policy.refund_policy}</p>}
                    {policy.notes && <p className="mt-2"><span className="font-semibold text-gray-900">Notes:</span> {policy.notes}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Tour policy details are currently unavailable.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="rounded-3xl border border-gray-200 bg-white p-6 h-fit">
          <p className="text-sm uppercase tracking-[0.2em] text-primary-600">Next departure</p>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {firstSchedule ? formatDate(firstSchedule.departure_date) : 'Schedule on request'}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {basePrice ? `Starting from ${formatCurrency(basePrice.price, basePrice.currency)}.` : 'Pricing will be confirmed once schedules are published.'}
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to={`/tours/${tour.id}/schedules`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              <Route className="h-4 w-4" />
              View schedules
            </Link>
            <Link
              to="/checkout"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 transition hover:border-gray-400"
            >
              Continue to checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
