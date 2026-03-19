import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { ProtectedLayout } from '../layouts/ProtectedLayout'
import { AccountLayout } from '../layouts/AccountLayout'
import { AdminLayout } from '../layouts/AdminLayout'

// Public Pages
import { HomePage } from '../pages/HomePage'
import { BlogListPage } from '../pages/BlogListPage'
import { BlogDetailPage } from '../pages/BlogDetailPage'
import { AboutPage } from '../pages/AboutPage'
import { ServicesPage } from '../pages/ServicesPage'
import { ContactPage } from '../pages/ContactPage'

// Auth Pages
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

// Protected Pages
import DashboardPage from '../pages/DashboardPage'
import FlightsPage from '../pages/FlightsPage'
import HotelsPage from '../pages/HotelsPage'
import ToursPage from '../pages/ToursPage'
import BookingDetailsPage from '../pages/BookingDetailsPage'
import PaymentPage from '../pages/PaymentPage'
import DocumentUploadPage from '../pages/DocumentUploadPage'

// Account Pages
// import ProfilePage from '../pages/account/ProfilePage'
// import AccountBookingsPage from '../pages/account/BookingsPage'
// import DocumentsPage from '../pages/account/DocumentsPage'
// import WalletPage from '../pages/account/WalletPage'
// import SettingsPage from '../pages/account/SettingsPage'

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard'
import AdminUsersPage from '../pages/admin/UsersPage'
import AdminBookingsPage from '../pages/admin/AdminBookingsPage'
import NotFoundPage from '../pages/NotFoundPage'

export const routes: RouteObject[] = [
  // Public Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:id', element: <BlogDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },

  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Protected Routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/flights', element: <FlightsPage /> },
      { path: '/hotels', element: <HotelsPage /> },
      { path: '/tours', element: <ToursPage /> },
      { path: '/bookings/:id', element: <BookingDetailsPage /> },
      { path: '/payment/:bookingId', element: <PaymentPage /> },
      { path: '/uploads', element: <DocumentUploadPage /> },
    ],
  },

  // Account Routes
  // {
  //   element: <AccountLayout />,
  //   children: [
  //     { path: '/account/profile', element: <ProfilePage /> },
  //     { path: '/account/bookings', element: <AccountBookingsPage /> },
  //     { path: '/account/documents', element: <DocumentsPage /> },
  //     { path: '/account/wallet', element: <WalletPage /> },
  //     { path: '/account/settings', element: <SettingsPage /> },
  //   ],
  // },

  // Admin Routes
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/bookings', element: <AdminBookingsPage /> },
      { path: '/admin/documents', element: <div>Admin Documents Page (TODO)</div> },
      { path: '/admin/payments', element: <div>Admin Payments Page (TODO)</div> },
    ],
  },

  // Error Routes
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
