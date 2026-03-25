import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { DestinationsPage } from '@/pages/public/DestinationsPage'
import { HelpPage } from '@/pages/public/HelpPage'
import { HomePage } from '@/pages/public/HomePage'
import { PromotionsPage } from '@/pages/public/PromotionsPage'
import { TourDetailPage } from '@/pages/public/TourDetailPage'
import { TourSchedulesPage } from '@/pages/public/TourSchedulesPage'
import { ToursPage } from '@/pages/public/ToursPage'

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/tours', element: <ToursPage /> },
      { path: '/tours/:id', element: <TourDetailPage /> },
      { path: '/tours/:id/schedules', element: <TourSchedulesPage /> },
      { path: '/destinations', element: <DestinationsPage /> },
      { path: '/promotions', element: <PromotionsPage /> },
      { path: '/help', element: <HelpPage /> },
    ],
  },
]
