import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, MapPin, Calendar, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface HotelResult {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image?: string;
  amenities: string[];
}

const HotelsSearch: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    rooms: '1',
    sortBy: 'popular',
  });
  const [hotels, setHotels] = useState<HotelResult[]>([
    {
      id: '1',
      name: 'Luxury Plaza Hotel',
      city: 'New York',
      rating: 4.8,
      reviews: 234,
      price: 199,
      originalPrice: 299,
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
    },
    {
      id: '2',
      name: 'Comfort Inn Downtown',
      city: 'New York',
      rating: 4.5,
      reviews: 156,
      price: 129,
      amenities: ['WiFi', 'Gym', 'Breakfast'],
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.destination || !filters.checkIn || !filters.checkOut) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Find Hotels</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <Input
              label="Destination"
              placeholder="City or hotel name"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              icon={<MapPin size={18} />}
            />
            <Input
              label="Check-in"
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
            />
            <Input
              label="Check-out"
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
              <select
                value={filters.rooms}
                onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Room' : 'Rooms'}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="font-bold mb-4">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Rating: High to Low</option>
                <option value="distance">Distance to Center</option>
              </select>

              <h3 className="font-bold mt-6 mb-4">Price Range</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
                <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
              </div>

              <h3 className="font-bold mt-6 mb-4">Rating</h3>
              {[5, 4, 3].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" className="rounded" />
                  {rating}+ stars
                </label>
              ))}

              <h3 className="font-bold mt-6 mb-4">Amenities</h3>
              {['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" className="rounded" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Hotel List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-blue-200 h-48 md:h-auto flex items-center justify-center">
                    <Hotel className="text-primary" size={48} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                      <p className="text-gray-600 mb-3">{hotel.city}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {Array(Math.round(hotel.rating)).fill('⭐')}
                        </div>
                        <span className="font-semibold text-gray-700">{hotel.rating}</span>
                        <span className="text-gray-500">({hotel.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity) => (
                          <span key={amenity} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between items-end border-l border-gray-200">
                    <div className="text-right">
                      {hotel.originalPrice && (
                        <p className="text-gray-500 line-through text-sm">${hotel.originalPrice}</p>
                      )}
                      <p className="text-3xl font-bold text-primary">${hotel.price}</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                    <Button onClick={() => navigate(`/bookings/hotel-${hotel.id}`)} className="mt-4">
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsSearch;
