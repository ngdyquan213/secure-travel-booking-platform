import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { routePaths } from './routePaths'
import { publicRoutes } from './routes/public.routes'

export const errorRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  ...publicRoutes,
  {
    path: '*',
    element: <Navigate replace to={routePaths.public.home} />,
  },
]
