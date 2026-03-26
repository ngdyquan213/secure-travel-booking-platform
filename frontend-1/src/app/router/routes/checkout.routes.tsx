import type { RouteObject } from 'react-router-dom'
import { CheckoutLayout } from '@/app/layouts/CheckoutLayout'
import { CheckoutPage } from '@/pages/checkout/CheckoutPage'
import { PaymentFailedPage } from '@/pages/checkout/PaymentFailedPage'
import { PaymentPage } from '@/pages/checkout/PaymentPage'
import { PaymentSuccessPage } from '@/pages/checkout/PaymentSuccessPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const checkoutRoutes: RouteObject[] = [
  {
    element: <CheckoutLayout />,
    children: [
      { path: stitchPages.checkoutReview.path, element: <CheckoutPage /> },
      { path: stitchPages.payment.path, element: <PaymentPage /> },
      { path: stitchPages.paymentSuccess.path, element: <PaymentSuccessPage /> },
      { path: stitchPages.paymentFailed.path, element: <PaymentFailedPage /> },
    ],
  },
]
