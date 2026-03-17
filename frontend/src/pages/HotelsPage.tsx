import { useState } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import { Hotel, AlertCircle, Star, MapPin } from 'lucide-react'
import * as types from '../types/api'

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useState<types.HotelSearchParams>({
    city: '',
    check_in_date: '',
    check_out_date: '',
    room_count: 1,
  })
  const [hotels, setHotels] = useState<types.Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.searchHotels(searchParams)
      setHotels(response.hotels)
      setSearched(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search hotels')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams({
      ...searchParams,
      [name]: name === 'room_count' ? parseInt(value) : value,
    })
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Hotels</h1>
        <p className="text-gray-600">Search and book hotels at great prices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Search Hotels</h2>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={searchParams.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris"
                  className="input-field"
                />
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <input
                  type="date"
                  name="check_in_date"
                  value={searchParams.check_in_date}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <input
                  type="date"
                  name="check_out_date"
                  value={searchParams.check_out_date}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                <select
                  name="room_count"
                  value={searchParams.room_count}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} room{n !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 mt-6 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {error && (
            <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!searched && (
            <div className="card p-12 text-center">
              <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for hotels</h3>
              <p className="text-gray-600">Enter your travel details to see available hotels</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
              </div>
            </div>
          )}

          {searched && !loading && hotels.length === 0 && (
            <div className="card p-12 text-center">
              <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Hotel Cards */}
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Hotel Info */}
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.city}, {hotel.country}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(hotel.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{hotel.rating}/5</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col items-end gap-3 md:whitespace-nowrap">
                    <div>
                      <p className="text-3xl font-bold text-primary-600">
                        {formatCurrency(hotel.price_per_night)}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                    <p className="text-sm text-gray-600">{hotel.available_rooms} rooms available</p>
                    <button className="btn-primary py-2 px-6">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
