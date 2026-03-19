import { RouteObject } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout'
import HomePage from '../../pages/public/HomePage'
import ToursPage from '../../pages/public/ToursPage'
import TourDetailPage from '../../pages/public/TourDetailPage'
import TourSchedulesPage from '../../pages/public/TourSchedulesPage'
import DestinationsPage from '../../pages/public/DestinationsPage'
import PromotionsPage from '../../pages/public/PromotionsPage'
import HelpPage from '../../pages/public/HelpPage'

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
