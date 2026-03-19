import { Outlet } from 'react-router-dom'
import { Plane } from 'lucide-react'

/**
 * AuthLayout - For login/register pages
 * Minimal layout with logo and centered content
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">TravelBook</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Outlet />
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2024 TravelBook. All rights reserved.
        </p>
      </div>
    </div>
  )
}
