import type { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import { CheckoutLayout } from '@/app/layouts/CheckoutLayout'
import { CheckoutPage } from '@/pages/checkout/CheckoutPage'
import { PaymentFailedPage } from '@/pages/checkout/PaymentFailedPage'
import { PaymentPage } from '@/pages/checkout/PaymentPage'
import { PaymentSuccessPage } from '@/pages/checkout/PaymentSuccessPage'

export const checkoutRoutes: RouteObject[] = [
  {
    path: '/checkout',
    element: (
      <AuthGuard>
        <CheckoutLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <CheckoutPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'success', element: <PaymentSuccessPage /> },
      { path: 'failed', element: <PaymentFailedPage /> },
    ],
  },
]
