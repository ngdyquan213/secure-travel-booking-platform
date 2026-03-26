import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { DestinationsPage } from '@/pages/public/DestinationsPage'
import { HelpPage } from '@/pages/public/HelpPage'
import { HomePage } from '@/pages/public/HomePage'
import { PromotionsPage } from '@/pages/public/PromotionsPage'
import { TourDetailPage } from '@/pages/public/TourDetailPage'
import { TourSchedulesPage } from '@/pages/public/TourSchedulesPage'
import { ToursPage } from '@/pages/public/ToursPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: stitchPages.home.path, element: <HomePage /> },
      { path: stitchPages.tours.path, element: <ToursPage /> },
      { path: stitchPages.tourDetail.path, element: <TourDetailPage /> },
      { path: stitchPages.tourSchedules.path, element: <TourSchedulesPage /> },
      { path: stitchPages.destinations.path, element: <DestinationsPage /> },
      { path: stitchPages.promotions.path, element: <PromotionsPage /> },
      { path: stitchPages.helpCenter.path, element: <HelpPage /> },
    ],
  },
]
