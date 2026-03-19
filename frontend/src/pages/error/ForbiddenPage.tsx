import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components'
import { Shield } from 'lucide-react'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md text-center py-12">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Forbidden</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. If you believe this is a mistake, please contact support.
        </p>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button onClick={() => navigate('/account/support')}>
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  )
}
