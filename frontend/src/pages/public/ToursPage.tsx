import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency } from '@/shared/lib/helpers'
import type { Tour } from '@/shared/types/api'

export function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destination, setDestination] = useState(searchParams.get('destination') ?? '')
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setDestination(searchParams.get('destination') ?? '')
  }, [searchParams])

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true)
        const response = await apiClient.searchTours({
          destination: destination || undefined,
          limit: 12,
        })
        setTours(response.tours)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load tours.')
      } finally {
        setLoading(false)
      }
    }

    void loadTours()
  }, [destination])

  return (
    <div className="container-custom py-12 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Tour catalog</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Find a trip that matches your pace</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Search active tours by destination and inspect schedules, itinerary blocks, and price rules in one flow.
          </p>
        </div>

        <label className="w-full max-w-sm">
          <span className="mb-2 block text-sm font-medium text-gray-700">Destination filter</span>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={destination}
              onChange={(event) => {
                const nextValue = event.target.value
                setDestination(nextValue)
                const nextParams = new URLSearchParams(searchParams)
                if (nextValue) {
                  nextParams.set('destination', nextValue)
                } else {
                  nextParams.delete('destination')
                }
                setSearchParams(nextParams, { replace: true })
              }}
              className="w-full bg-transparent outline-none"
              placeholder="Search by city or region"
            />
          </div>
        </label>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-600">Loading tours...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      ) : tours.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          No tours matched the current destination filter.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <article key={tour.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {tour.status ?? 'ACTIVE'}
                </span>
                <span className="text-sm text-gray-500">{tour.duration_days} days</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">{tour.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {tour.destination}
              </p>
              <p className="mt-4 text-sm text-gray-600">{tour.description || 'Tour description will be available soon.'}</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-xl font-bold text-gray-900">
                    {tour.price ? formatCurrency(tour.price, tour.schedules?.[0]?.price_rules?.[0]?.currency ?? 'USD') : 'Quote on request'}
                  </p>
                </div>
                <Link
                  to={`/tours/${tour.id}`}
                  className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
