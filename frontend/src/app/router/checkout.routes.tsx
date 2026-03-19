import { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import CheckoutLayout from '../../layouts/CheckoutLayout'
import CheckoutPage from '../../pages/checkout/CheckoutPage'
import PaymentPage from '../../pages/checkout/PaymentPage'
import PaymentSuccessPage from '../../pages/checkout/PaymentSuccessPage'
import PaymentFailedPage from '../../pages/checkout/PaymentFailedPage'

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
