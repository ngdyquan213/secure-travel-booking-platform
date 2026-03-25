import { Link, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

interface SidebarProps {
  items: NavItem[]
  title?: string
}

export function Sidebar({ items, title }: SidebarProps) {
  const location = useLocation()

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 min-h-screen">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
      )}
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
