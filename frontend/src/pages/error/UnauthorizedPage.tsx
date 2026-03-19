import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components'
import { AlertCircle } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md text-center py-12">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">401</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this page. Please log in to continue.
        </p>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </Card>
    </div>
  )
}
