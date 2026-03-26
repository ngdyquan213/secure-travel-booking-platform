import type { RouteObject } from 'react-router-dom'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { BookingsManagementPage } from '@/pages/admin/BookingsManagementPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { DocumentsReviewPage } from '@/pages/admin/DocumentsReviewPage'
import { OperationsPage } from '@/pages/admin/OperationsPage'
import { PricingManagementPage } from '@/pages/admin/PricingManagementPage'
import { RefundsManagementPage } from '@/pages/admin/RefundsManagementPage'
import { SchedulesManagementPage } from '@/pages/admin/SchedulesManagementPage'
import { ToursManagementPage } from '@/pages/admin/ToursManagementPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const adminRoutes: RouteObject[] = [
  {
    element: <AdminLayout />,
    children: [
      { path: stitchPages.adminDashboard.path, element: <DashboardPage /> },
      { path: stitchPages.adminTours.path, element: <ToursManagementPage /> },
      { path: stitchPages.adminBookings.path, element: <BookingsManagementPage /> },
      { path: stitchPages.adminDocuments.path, element: <DocumentsReviewPage /> },
      { path: stitchPages.adminRefunds.path, element: <RefundsManagementPage /> },
      { path: stitchPages.adminSchedules.path, element: <SchedulesManagementPage /> },
      { path: stitchPages.adminPricing.path, element: <PricingManagementPage /> },
      { path: stitchPages.adminOperations.path, element: <OperationsPage /> },
    ],
  },
]
