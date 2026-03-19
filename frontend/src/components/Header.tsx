import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'
import { Menu, X, LogOut, Home, Plane, Hotel, MapPin, Upload, Settings, BookOpen, Users } from 'lucide-react'
import { getInitials } from '../utils/helpers'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isAdmin = user?.id === 'admin-user-id' // Placeholder - should check actual admin role

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">TravelBook</span>
          </Link>

          {/* Desktop Navigation - Authenticated */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/flights"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Plane className="w-4 h-4" />
                Flights
              </Link>
              <Link
                to="/hotels"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Hotel className="w-4 h-4" />
                Hotels
              </Link>
              <Link
                to="/tours"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Tours
              </Link>
              <Link
                to="/blog"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </Link>
              <Link
                to="/uploads"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Documents
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Desktop Navigation - Non-Authenticated */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/blog" className="text-gray-700 hover:text-primary-600 transition-colors">
                Blog
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-primary-600 transition-colors">
                Services
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Contact
              </Link>
            </nav>
          )}

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {/* Desktop User Menu */}
                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600">{getInitials(user.name)}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - Authenticated */}
        {isAuthenticated && menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 pt-4 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/flights"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Plane className="w-4 h-4" />
              Flights
            </Link>
            <Link
              to="/hotels"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Hotel className="w-4 h-4" />
              Hotels
            </Link>
            <Link
              to="/tours"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <MapPin className="w-4 h-4" />
              Tours
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </Link>
            <Link
              to="/uploads"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Upload className="w-4 h-4" />
              Documents
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        )}

        {/* Mobile Menu - Non-Authenticated */}
        {!isAuthenticated && menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 pt-4 flex flex-col gap-2">
            <Link
              to="/blog"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
