import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency, generateIdempotencyKeySimple } from '../utils/helpers'
import { ArrowLeft, AlertCircle, CreditCard } from 'lucide-react'
import * as types from '../types/api'

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<types.Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  })

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return
      try {
        const response = await apiClient.getBooking(bookingId)
        setBooking(response.booking)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    if (!bookingId) return

    try {
      const idempotencyKey = generateIdempotencyKeySimple()
      await apiClient.initiatePayment({
        booking_id: bookingId,
        payment_method: paymentMethod,
        idempotency_key: idempotencyKey,
      })

      // Simulate payment processing
      setTimeout(() => {
        navigate(`/bookings/${bookingId}`)
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-12 flex items-center justify-center min-h-96">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container-custom py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="card p-6 bg-red-50 border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error || 'Booking not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <button
        onClick={() => navigate(`/bookings/${bookingId}`)}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Booking
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
            <p className="text-gray-600 mb-8">Secure payment processing for your booking</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-3">
                  {['credit_card', 'debit_card', 'bank_transfer'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {['credit_card', 'debit_card'].includes(paymentMethod) && (
                <div className="space-y-4">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full btn-primary py-3 mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ${formatCurrency(booking.total_price)}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Booking Type</span>
                <span className="font-medium text-gray-900 capitalize">{booking.booking_type.toLowerCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Travelers</span>
                <span className="font-medium text-gray-900">{booking.number_of_travelers}</span>
              </div>
            </div>

            <div className="mt-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(booking.total_price)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">{formatCurrency(0)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
