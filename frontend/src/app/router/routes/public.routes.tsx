import type { RouteObject } from 'react-router-dom'
import { routePaths } from '@/app/router/routePaths'
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
    path: routePaths.public.home,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: routePaths.public.tours.slice(1),
        element: <ToursPage />,
      },
      {
        path: routePaths.public.promotions.slice(1),
        element: <PromotionsPage />,
      },
      {
        path: routePaths.public.tourDetail.slice(1),
        element: <TourDetailPage />,
      },
      {
        path: routePaths.public.tourSchedules.slice(1),
        element: <TourSchedulesPage />,
      },
      {
        path: routePaths.public.destinations.slice(1),
        element: <DestinationsPage />,
      },
      {
        path: routePaths.public.help.slice(1),
        element: <HelpPage />,
      },
    ],
  },
]
