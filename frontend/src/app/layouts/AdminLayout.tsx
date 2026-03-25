import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, BookOpen, FileText, HandCoins, LogOut, Map, Settings2 } from 'lucide-react'
import MainHeader from '@/shared/navigation/MainHeader'
import { useAuthStore } from '@/features/auth/model/auth.store'

/**
 * AdminLayout - For admin pages
 * Includes admin navigation and requires admin role
 */
export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const navItems = [
    { label: 'Dashboard', icon: BarChart3, href: '/admin/dashboard' },
    { label: 'Tours', icon: Map, href: '/admin/tours' },
    { label: 'Schedules', icon: Settings2, href: '/admin/tour-schedules' },
    { label: 'Bookings', icon: BookOpen, href: '/admin/bookings' },
    { label: 'Refunds', icon: HandCoins, href: '/admin/refunds' },
    { label: 'Documents', icon: FileText, href: '/admin/documents' },
    { label: 'Operations', icon: Settings2, href: '/admin/operations' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => void handleLogout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
