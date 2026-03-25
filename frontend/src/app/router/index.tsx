import type { RouteObject } from 'react-router-dom'
import { accountRoutes } from './account.routes'
import { adminRoutes } from './admin.routes'
import { authRoutes } from './auth.routes'
import { checkoutRoutes } from './checkout.routes'
import { publicRoutes } from './public.routes'

export const errorRoutes: RouteObject[] = [
  {
    path: '/403',
    lazy: async () => {
      const module = await import('@/pages/errors/ForbiddenPage')
      return { Component: module.ForbiddenPage }
    },
  },
  {
    path: '/500',
    lazy: async () => {
      const module = await import('@/pages/errors/ServerErrorPage')
      return { Component: module.ServerErrorPage }
    },
  },
  {
    path: '*',
    lazy: async () => {
      const module = await import('@/pages/errors/NotFoundPage')
      return { Component: module.NotFoundPage }
    },
  },
]

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...checkoutRoutes,
  ...accountRoutes,
  ...adminRoutes,
  ...errorRoutes,
]
