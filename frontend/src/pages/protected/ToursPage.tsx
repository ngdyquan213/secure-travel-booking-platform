import { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import { MapPin, AlertCircle, Users, Calendar } from 'lucide-react'
import * as types from '../types/api'

export default function ToursPage() {
  const [tours, setTours] = useState<types.Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [destination, setDestination] = useState('')

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await apiClient.searchTours({ destination })
        setTours(response.tours)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [destination])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value)
    setLoading(true)
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Tours</h1>
        <p className="text-gray-600">Discover amazing tour packages around the world</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by destination..."
          value={destination}
          onChange={handleSearch}
          className="input-field w-full max-w-md"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && tours.length === 0 && (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-600">Try searching for a different destination</p>
        </div>
      )}

      {/* Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="card hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
            {/* Placeholder Image */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white opacity-50" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{tour.destination}</p>

              <p className="text-gray-600 text-sm mb-4 flex-1">{tour.description}</p>

              {/* Tour Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{tour.duration_days} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{tour.available_slots} slots available</span>
                </div>
              </div>

              {/* Activities */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">Activities:</p>
                <div className="flex flex-wrap gap-1">
                  {tour.activities.slice(0, 3).map((activity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Button */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(tour.price)}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
                <button className="btn-primary py-2 px-4">Book Tour</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
