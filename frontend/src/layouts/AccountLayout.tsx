import { Outlet, Link, useLocation } from 'react-router-dom'
import { User, Settings, BookOpen, FileText, Wallet } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuthGuard } from '../guards'
import { Navigate } from 'react-router-dom'

/**
 * AccountLayout - For account/profile pages
 * Includes sidebar navigation for account sections
 */
export function AccountLayout() {
  const { isAuthenticated, isLoading } = useAuthGuard()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const navItems = [
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'Bookings', icon: BookOpen, href: '/account/bookings' },
    { label: 'Documents', icon: FileText, href: '/account/documents' },
    { label: 'Wallet', icon: Wallet, href: '/account/wallet' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:col-span-1">
              <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
