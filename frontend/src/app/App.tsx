import { useRoutes } from 'react-router-dom'
import { routes } from './router'

function App() {
  const routing = useRoutes(routes)

  return routing
}

export default App
