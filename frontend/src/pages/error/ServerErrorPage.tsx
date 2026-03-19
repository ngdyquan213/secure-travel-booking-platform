import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components'
import { AlertTriangle } from 'lucide-react'

export default function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">500</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Server Error</h2>
        <p className="text-gray-600 mb-6">
          Something went wrong on our end. Our team has been notified and is working to fix it.
        </p>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </Card>
    </div>
  )
}
