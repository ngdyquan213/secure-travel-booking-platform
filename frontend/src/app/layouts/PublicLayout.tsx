import { Outlet } from 'react-router-dom'
import MainHeader from '@/shared/navigation/MainHeader'
import MainFooter from '@/shared/navigation/MainFooter'

/**
 * PublicLayout - For pages accessible without authentication
 * (home, blog, about, services, contact)
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-background)] text-[color:var(--color-on-background)]">
      <MainHeader />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  )
}
