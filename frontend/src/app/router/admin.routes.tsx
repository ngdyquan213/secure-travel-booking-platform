import { RouteObject } from 'react-router-dom'
import { AdminGuard } from './guards/AdminGuard'
import AdminLayout from '../../layouts/AdminLayout'
import AdminDashboardPage from '../../pages/admin/DashboardPage'
import NotFoundPage from '../../pages/error/NotFoundPage'

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
    ],
  },
]

export const errorRoutes: RouteObject[] = [
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
