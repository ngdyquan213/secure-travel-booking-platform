import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Plane, DollarSign } from 'lucide-react';
import { adminAPI } from '../lib/api';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  pendingBookings: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockStats = [
    {
      icon: <BarChart3 className="text-blue-500" size={32} />,
      label: 'Total Bookings',
      value: 1248,
      change: '+12.5%',
    },
    {
      icon: <DollarSign className="text-green-500" size={32} />,
      label: 'Total Revenue',
      value: '$485,600',
      change: '+8.2%',
    },
    {
      icon: <Users className="text-purple-500" size={32} />,
      label: 'Total Users',
      value: 3421,
      change: '+5.1%',
    },
    {
      icon: <Plane className="text-orange-500" size={32} />,
      label: 'Pending Bookings',
      value: 23,
      change: '-2.4%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your travel booking platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Booking #{1000 + i}</p>
                    <p className="text-sm text-gray-600">Flight - New York to London</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$599</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Recent Users</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div>
                      <p className="font-semibold">User {i}</p>
                      <p className="text-sm text-gray-600">user{i}@example.com</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">2 bookings</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Booking Types</h2>
            <div className="space-y-4">
              {[
                { type: 'Flights', count: 548, percentage: 45 },
                { type: 'Hotels', count: 425, percentage: 35 },
                { type: 'Tours', count: 275, percentage: 20 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Monthly Revenue</h2>
            <div className="space-y-4">
              {[
                { month: 'Jan', amount: 45000 },
                { month: 'Feb', amount: 52000 },
                { month: 'Mar', amount: 48000 },
                { month: 'Apr', amount: 61000 },
                { month: 'May', amount: 65000 },
                { month: 'Jun', amount: 72000 },
              ].map((item) => (
                <div key={item.month}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.month}</span>
                    <span className="text-gray-600">${item.amount / 1000}k</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: `${(item.amount / 75000) * 100}%` }}
                    ></div>
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

export default AdminDashboard;
