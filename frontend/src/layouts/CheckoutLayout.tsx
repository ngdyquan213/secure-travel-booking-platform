import { Outlet } from 'react-router-dom'
import { Stepper } from '../components/common/Stepper'
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * CheckoutLayout - For booking/checkout flow pages
 * Includes progress stepper showing checkout steps
 */
export function CheckoutLayout() {
  const steps = [
    { id: 1, label: 'Booking', path: '/checkout/booking' },
    { id: 2, label: 'Travelers', path: '/checkout/travelers' },
    { id: 3, label: 'Payment', path: '/checkout/payment' },
    { id: 4, label: 'Confirmation', path: '/checkout/confirmation' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Progress Stepper */}
          <div className="mb-12">
            <Stepper steps={steps} />
          </div>

          {/* Checkout Content */}
          <div className="bg-white rounded-lg shadow p-8">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
