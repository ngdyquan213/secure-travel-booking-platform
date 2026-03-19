import { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import AccountLayout from '../../layouts/AccountLayout'
import DashboardPage from '../../pages/account/DashboardPage'
import ProfilePage from '../../pages/account/ProfilePage'
import EditProfilePage from '../../pages/account/EditProfilePage'
import ChangePasswordPage from '../../pages/account/ChangePasswordPage'
import TravelersPage from '../../pages/account/TravelersPage'
import BookingsPage from '../../pages/account/BookingsPage'
import BookingDetailPage from '../../pages/account/BookingDetailPage'
import VouchersPage from '../../pages/account/VouchersPage'
import DocumentsPage from '../../pages/account/DocumentsPage'
import DocumentDetailPage from '../../pages/account/DocumentDetailPage'
import RefundRequestPage from '../../pages/account/RefundRequestPage'
import RefundDetailPage from '../../pages/account/RefundDetailPage'
import NotificationsPage from '../../pages/account/NotificationsPage'
import SupportPage from '../../pages/account/SupportPage'

export const accountRoutes: RouteObject[] = [
  {
    path: '/account',
    element: (
      <AuthGuard>
        <AccountLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <EditProfilePage /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'travelers', element: <TravelersPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      { path: 'vouchers', element: <VouchersPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'documents/:id', element: <DocumentDetailPage /> },
      { path: 'refunds', element: <RefundRequestPage /> },
      { path: 'refunds/:id', element: <RefundDetailPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'support', element: <SupportPage /> },
    ],
  },
]
