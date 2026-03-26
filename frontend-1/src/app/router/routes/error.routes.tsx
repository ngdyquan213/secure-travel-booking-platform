import type { RouteObject } from 'react-router-dom'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import { ServerErrorPage } from '@/pages/errors/ServerErrorPage'
import { PageDirectoryPage } from '@/pages/system/PageDirectoryPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const errorRoutes: RouteObject[] = [
  { path: '/pages', element: <PageDirectoryPage /> },
  { path: stitchPages.serverError.path, element: <ServerErrorPage /> },
  { path: '/server-error', element: <ServerErrorPage /> },
  { path: stitchPages.notFound.path, element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]
