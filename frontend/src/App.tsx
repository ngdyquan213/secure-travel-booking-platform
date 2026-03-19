import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightsSearch from './pages/FlightsSearch';
import HotelsSearch from './pages/HotelsSearch';
import ToursSearch from './pages/ToursSearch';
import Dashboard from './pages/Dashboard';
import BookingDetail from './pages/BookingDetail';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { getCurrentUser } = useAuthStore();
  const isAuthenticated = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flights" element={<FlightsSearch />} />
            <Route path="/hotels" element={<HotelsSearch />} />
            <Route path="/tours" element={<ToursSearch />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
