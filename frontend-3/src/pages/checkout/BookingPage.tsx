import { useParams, useNavigate } from 'react-router-dom'
import { Stepper, Card, Button } from '../../components'
import { useState } from 'react'

export default function BookingPage() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { label: 'Review' },
    { label: 'Travelers', completed: false },
    { label: 'Payment', completed: false },
  ]

  const handleReviewComplete = async () => {
    setIsLoading(true)
    try {
      // Review the booking details
      navigate(`/checkout/travelers`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Stepper steps={steps} currentStep={0} />
      
      <Card className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Review Your Booking</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-600">Type</label>
            <p className="font-medium capitalize">{type}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Item ID</label>
            <p className="font-medium">{id}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button loading={isLoading} onClick={handleReviewComplete}>
            Continue to Travelers
          </Button>
        </div>
      </Card>
    </div>
  )
}
