import { useRoutes } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { routes } from './router'

function App() {
  const { isInitializing } = useAuth()
  const routing = useRoutes(routes)

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  return routing
}

export default App
