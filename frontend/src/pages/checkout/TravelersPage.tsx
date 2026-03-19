import { useNavigate } from 'react-router-dom'
import { Stepper, Card, Button, Input, FormField } from '../../components'
import { useState } from 'react'

export default function TravelersPage() {
  const navigate = useNavigate()
  const [travelers, setTravelers] = useState([
    { id: 1, firstName: '', lastName: '', dateOfBirth: '', passport: '' }
  ])

  const handleAddTraveler = () => {
    setTravelers([
      ...travelers,
      { id: travelers.length + 1, firstName: '', lastName: '', dateOfBirth: '', passport: '' }
    ])
  }

  const handleTravelerChange = (id: number, field: string, value: string) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const steps = [
    { label: 'Review', completed: true },
    { label: 'Travelers' },
    { label: 'Payment', completed: false },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Stepper steps={steps} currentStep={1} />
      
      <Card className="mt-6">
        <h2 className="text-2xl font-bold mb-6">Add Travelers</h2>

        {travelers.map((traveler) => (
          <div key={traveler.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-4">Traveler {traveler.id}</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" required>
                <Input
                  value={traveler.firstName}
                  onChange={(e) => handleTravelerChange(traveler.id, 'firstName', e.target.value)}
                  placeholder="John"
                />
              </FormField>
              <FormField label="Last Name" required>
                <Input
                  value={traveler.lastName}
                  onChange={(e) => handleTravelerChange(traveler.id, 'lastName', e.target.value)}
                  placeholder="Doe"
                />
              </FormField>
              <FormField label="Date of Birth" required>
                <Input
                  type="date"
                  value={traveler.dateOfBirth}
                  onChange={(e) => handleTravelerChange(traveler.id, 'dateOfBirth', e.target.value)}
                />
              </FormField>
              <FormField label="Passport" required>
                <Input
                  value={traveler.passport}
                  onChange={(e) => handleTravelerChange(traveler.id, 'passport', e.target.value)}
                  placeholder="ABC123456"
                />
              </FormField>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddTraveler} className="mb-6">
          Add Another Traveler
        </Button>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={() => navigate('/checkout/payment/booking-123')}>
            Continue to Payment
          </Button>
        </div>
      </Card>
    </div>
  )
}
