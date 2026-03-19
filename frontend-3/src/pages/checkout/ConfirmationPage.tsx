import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your booking has been successfully completed. A confirmation email has been sent to your registered email.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
          <p className="text-2xl font-bold text-primary-600">{bookingId}</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/account/bookings')}>
            View My Bookings
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
