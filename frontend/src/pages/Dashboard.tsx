import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, MapPin, Calendar, LogOut, Settings, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { bookingsAPI } from '../lib/api';
import { Button } from '../components/Button';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'tour';
  title: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  image?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      type: 'flight',
      title: 'New York to London',
      date: '2024-04-15',
      status: 'confirmed',
      price: 599,
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Luxury Plaza Hotel',
      date: '2024-04-15',
      status: 'confirmed',
      price: 199,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getList();
      setBookings(response.data.items || response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane size={20} />;
      case 'hotel':
        return <Hotel size={20} />;
      case 'tour':
        return <MapPin size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success bg-opacity-10 text-success';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'cancelled':
        return 'bg-error bg-opacity-10 text-error';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.full_name}!</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => navigate('/dashboard/settings')}>
                <Settings size={18} />
                Settings
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Confirmed</p>
            <p className="text-3xl font-bold text-success">{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-warning">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-primary">
              ${bookings.reduce((sum, b) => sum + b.price, 0)}
            </p>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <div className="flex gap-2">
                {['all', 'upcoming', 'past'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'all' | 'upcoming' | 'past')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-primary">
                        {getBookingIcon(booking.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{booking.title}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 md:text-right">
                      <p className="font-bold text-lg mb-2">${booking.price}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/bookings/${booking.id}`)}>
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Plane className="text-gray-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Button onClick={() => navigate('/flights')}>
                  Start Planning Your Trip
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
