import { Outlet, useLocation } from 'react-router-dom'
import { Stepper } from '@/shared/components/Stepper'
import MainHeader from '@/shared/navigation/MainHeader'
import MainFooter from '@/shared/navigation/MainFooter'

/**
 * CheckoutLayout - For booking/checkout flow pages
 * Includes progress stepper showing checkout steps
 */
export function CheckoutLayout() {
  const location = useLocation()
  const steps = [
    { label: 'Review booking' },
    { label: 'Payment' },
    { label: 'Result' },
  ]

  const currentStep = location.pathname.endsWith('/payment')
    ? 1
    : location.pathname.endsWith('/success') || location.pathname.endsWith('/failed')
      ? 2
      : 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MainHeader />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Progress Stepper */}
          <div className="mb-12">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>

          {/* Checkout Content */}
          <div className="bg-white rounded-lg shadow p-8">
            <Outlet />
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
