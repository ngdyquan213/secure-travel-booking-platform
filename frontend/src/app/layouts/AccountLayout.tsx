import { Outlet, Link, useLocation } from 'react-router-dom'
import { Bell, BookOpen, FileText, LifeBuoy, ShieldCheck, User, Users, Ticket } from 'lucide-react'
import MainHeader from '@/shared/navigation/MainHeader'
import MainFooter from '@/shared/navigation/MainFooter'

/**
 * AccountLayout - For account/profile pages
 * Includes sidebar navigation for account sections
 */
export function AccountLayout() {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: ShieldCheck, href: '/account/dashboard' },
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'Travelers', icon: Users, href: '/account/travelers' },
    { label: 'Bookings', icon: BookOpen, href: '/account/bookings' },
    { label: 'Vouchers', icon: Ticket, href: '/account/vouchers' },
    { label: 'Documents', icon: FileText, href: '/account/documents' },
    { label: 'Notifications', icon: Bell, href: '/account/notifications' },
    { label: 'Support', icon: LifeBuoy, href: '/account/support' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MainHeader />
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
      <MainFooter />
    </div>
  )
}
