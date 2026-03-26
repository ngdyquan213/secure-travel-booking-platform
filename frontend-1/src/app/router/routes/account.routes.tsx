import type { RouteObject } from 'react-router-dom'
import { AccountLayout } from '@/app/layouts/AccountLayout'
import { BookingDetailPage } from '@/pages/account/BookingDetailPage'
import { BookingsPage } from '@/pages/account/BookingsPage'
import { DashboardPage } from '@/pages/account/DashboardPage'
import { DocumentsPage } from '@/pages/account/DocumentsPage'
import { NotificationsPage } from '@/pages/account/NotificationsPage'
import { ProfilePage } from '@/pages/account/ProfilePage'
import { RefundDetailPage } from '@/pages/account/RefundDetailPage'
import { RefundsPage } from '@/pages/account/RefundsPage'
import { SupportPage } from '@/pages/account/SupportPage'
import { TravelersPage } from '@/pages/account/TravelersPage'
import { VouchersPage } from '@/pages/account/VouchersPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const accountRoutes: RouteObject[] = [
  {
    element: <AccountLayout />,
    children: [
      { path: stitchPages.accountDashboard.path, element: <DashboardPage /> },
      { path: stitchPages.profile.path, element: <ProfilePage /> },
      { path: stitchPages.travelers.path, element: <TravelersPage /> },
      { path: stitchPages.bookings.path, element: <BookingsPage /> },
      { path: stitchPages.bookingDetail.path, element: <BookingDetailPage /> },
      { path: stitchPages.vouchers.path, element: <VouchersPage /> },
      { path: stitchPages.documents.path, element: <DocumentsPage /> },
      { path: stitchPages.refunds.path, element: <RefundsPage /> },
      { path: stitchPages.refundDetail.path, element: <RefundDetailPage /> },
      { path: stitchPages.notifications.path, element: <NotificationsPage /> },
      { path: stitchPages.support.path, element: <SupportPage /> },
    ],
  },
]
