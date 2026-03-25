import { useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import type { Tour } from '@/shared/types/api'

export function TourManagementPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await apiClient.searchTours({ limit: 20 })
        setTours(response.tours)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load tours.')
      } finally {
        setLoading(false)
      }
    }

    void loadTours()
  }, [])

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading tours...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tour management overview</h1>
      <div className="grid gap-4">
        {tours.map((tour) => (
          <div key={tour.id} className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h2 className="font-semibold text-gray-900">{tour.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{tour.destination} • {tour.status ?? 'ACTIVE'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
