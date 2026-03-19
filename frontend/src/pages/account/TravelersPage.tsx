import { useState } from 'react'
import { Card, Button, Input, FormField, Modal, Table } from '../../components'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Traveler {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  passport: string
  nationality: string
}

export default function TravelersPage() {
  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      passport: 'ABC123456',
      nationality: 'US',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Traveler>>({})

  const handleAddTraveler = () => {
    setFormData({})
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (formData.id) {
      setTravelers(travelers.map(t => t.id === formData.id ? (formData as Traveler) : t))
    } else {
      setTravelers([...travelers, { ...formData, id: Date.now().toString() } as Traveler])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setTravelers(travelers.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Travelers</h1>
        <Button onClick={handleAddTraveler}>
          <Plus className="w-4 h-4 mr-2" />
          Add Traveler
        </Button>
      </div>

      <Card>
        <Table
          headers={['First Name', 'Last Name', 'Passport', 'Nationality', 'Actions']}
          rows={travelers.map(t => ({
            'First Name': t.firstName,
            'Last Name': t.lastName,
            'Passport': t.passport,
            'Nationality': t.nationality,
            'Actions': (
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          }))}
        />
      </Card>

      {isModalOpen && (
        <Modal title="Add Traveler" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <FormField label="First Name">
              <Input
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </FormField>
            <FormField label="Last Name">
              <Input
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </FormField>
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </FormField>
            <FormField label="Passport">
              <Input
                value={formData.passport || ''}
                onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
              />
            </FormField>
            <FormField label="Nationality">
              <Input
                value={formData.nationality || ''}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              />
            </FormField>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
