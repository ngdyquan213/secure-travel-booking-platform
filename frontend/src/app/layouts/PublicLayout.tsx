import { Outlet } from 'react-router-dom'
import MainHeader from '@/shared/navigation/MainHeader'
import MainFooter from '@/shared/navigation/MainFooter'

/**
 * PublicLayout - For pages accessible without authentication
 * (home, blog, about, services, contact)
 */
export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MainHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  )
}
