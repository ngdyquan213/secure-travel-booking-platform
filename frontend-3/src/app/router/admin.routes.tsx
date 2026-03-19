import { RouteObject } from 'react-router-dom'
import { AdminGuard } from './guards/AdminGuard'
import AdminLayout from '../../layouts/AdminLayout'
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage'
import AdminToursPage from '../../pages/admin/AdminToursPage'
import AdminTourSchedulesPage from '../../pages/admin/AdminTourSchedulesPage'
import AdminPricingRulesPage from '../../pages/admin/AdminPricingRulesPage'
import AdminBookingsPage from '../../pages/admin/AdminBookingsPage'
import AdminBookingDetailPage from '../../pages/admin/AdminBookingDetailPage'
import AdminRefundsPage from '../../pages/admin/AdminRefundsPage'
import AdminDocumentsPage from '../../pages/admin/AdminDocumentsPage'
import AdminOperationsPage from '../../pages/admin/AdminOperationsPage'

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'tours', element: <AdminToursPage /> },
      { path: 'tour-schedules', element: <AdminTourSchedulesPage /> },
      { path: 'pricing-rules', element: <AdminPricingRulesPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'bookings/:id', element: <AdminBookingDetailPage /> },
      { path: 'refunds', element: <AdminRefundsPage /> },
      { path: 'documents', element: <AdminDocumentsPage /> },
      { path: 'operations', element: <AdminOperationsPage /> },
    ],
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '403',
    element: <ForbiddenPage />,
  },
  {
    path: '500',
    element: <ServerErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

// Import error pages
import NotFoundPage from '../../pages/errors/NotFoundPage'
import ForbiddenPage from '../../pages/errors/ForbiddenPage'
import ServerErrorPage from '../../pages/errors/ServerErrorPage'
