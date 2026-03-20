import { RouteObject } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import CheckoutLayout from '../../layouts/CheckoutLayout'
import PaymentPage from '../../pages/checkout/PaymentPage'

export const checkoutRoutes: RouteObject[] = [
  {
    path: '/checkout',
    element: (
      <AuthGuard>
        <CheckoutLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <PaymentPage /> },
      { path: 'payment', element: <PaymentPage /> },
    ],
  },
]
