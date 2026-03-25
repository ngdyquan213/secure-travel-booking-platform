import type { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import { AccountLayout } from '@/app/layouts/AccountLayout'
import { BookingDetailPage } from '@/pages/account/BookingDetailPage'
import { ChangePasswordPage } from '@/pages/account/ChangePasswordPage'
import { DashboardPage } from '@/pages/account/DashboardPage'
import { RefundDetailPage } from '@/pages/account/RefundDetailPage'
import { RefundsPage } from '@/pages/account/RefundsPage'
import { VouchersPage } from '@/pages/account/VouchersPage'
import BookingsPage from '@/pages/account/BookingsPage'
import DocumentsPage from '@/pages/account/DocumentsPage'
import NotificationsPage from '@/pages/account/NotificationsPage'
import ProfilePage from '@/pages/account/ProfilePage'
import SupportPage from '@/pages/account/SupportPage'
import TravelersPage from '@/pages/account/TravelersPage'

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
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'travelers', element: <TravelersPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      { path: 'vouchers', element: <VouchersPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'refunds', element: <RefundsPage /> },
      { path: 'refunds/:id', element: <RefundDetailPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'support', element: <SupportPage /> },
    ],
  },
]
