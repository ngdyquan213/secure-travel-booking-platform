import { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import AccountLayout from '../../layouts/AccountLayout'
import ProfilePage from '../../pages/account/ProfilePage'
import BookingsPage from '../../pages/account/BookingsPage'
import DocumentsPage from '../../pages/account/DocumentsPage'
import WalletPage from '../../pages/account/WalletPage'
import SettingsPage from '../../pages/account/SettingsPage'
import TravelersPage from '../../pages/account/TravelersPage'
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
      { path: 'profile', element: <ProfilePage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'travelers', element: <TravelersPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'support', element: <SupportPage /> },
    ],
  },
]
