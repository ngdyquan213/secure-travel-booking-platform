import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { BarChart3, Users, BookOpen, FileText, CreditCard, LogOut } from 'lucide-react'
import Header from '../components/Header'
import { useAuthGuard, useAdminGuard } from '../guards'

/**
 * AdminLayout - For admin pages
 * Includes admin navigation and requires admin role
 */
export function AdminLayout() {
  const { isLoading: authLoading } = useAuthGuard()
  const { isAdmin, isLoading: adminLoading } = useAdminGuard()
  const location = useLocation()

  const isLoading = authLoading || adminLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const navItems = [
    { label: 'Dashboard', icon: BarChart3, href: '/admin' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Bookings', icon: BookOpen, href: '/admin/bookings' },
    { label: 'Documents', icon: FileText, href: '/admin/documents' },
    { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  ]

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
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
