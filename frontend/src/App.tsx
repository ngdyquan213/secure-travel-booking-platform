import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import FlightsPage from './pages/FlightsPage'
import HotelsPage from './pages/HotelsPage'
import ToursPage from './pages/ToursPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import PaymentPage from './pages/PaymentPage'
import DocumentUploadPage from './pages/DocumentUploadPage'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const { initializeAuth, isInitializing } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/bookings/:id" element={<BookingDetailsPage />} />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/uploads" element={<DocumentUploadPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Redirects and Fallbacks */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
