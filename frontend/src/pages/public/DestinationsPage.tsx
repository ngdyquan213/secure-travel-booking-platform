import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, MapPinned } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import type { Tour } from '@/shared/types/api'

export function DestinationsPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await apiClient.searchTours({ limit: 50 })
        setTours(response.tours)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load destinations.')
      } finally {
        setLoading(false)
      }
    }

    void loadTours()
  }, [])

  const destinations = useMemo(() => {
    const grouped = new Map<string, number>()
    tours.forEach((tour) => {
      grouped.set(tour.destination, (grouped.get(tour.destination) ?? 0) + 1)
    })
    return Array.from(grouped.entries()).map(([name, count]) => ({ name, count }))
  }, [tours])

  return (
    <div className="container-custom py-12 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Destinations</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Browse where current tours can take you</h1>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-600">Loading destinations...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <div key={destination.name} className="rounded-3xl border border-gray-200 bg-white p-6">
              <MapPinned className="h-8 w-8 text-primary-600" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">{destination.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{destination.count} active tour option(s) currently published.</p>
              <Link
                to={`/tours?destination=${encodeURIComponent(destination.name)}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Explore tours
                <Compass className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
