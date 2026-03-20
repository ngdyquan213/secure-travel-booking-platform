import { RouteObject } from 'react-router-dom'
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { checkoutRoutes } from './checkout.routes'
import { accountRoutes } from './account.routes'
import { adminRoutes, errorRoutes } from './admin.routes'

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...checkoutRoutes,
  ...accountRoutes,
  ...adminRoutes,
  ...errorRoutes,
]
