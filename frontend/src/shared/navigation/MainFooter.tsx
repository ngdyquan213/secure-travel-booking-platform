import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-custom">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">TravelBook</span>
            </div>
            <p className="text-sm text-gray-400">
              Your secure and trusted travel booking platform. Book flights, hotels, and tours with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-white transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-gray-400 hover:text-white transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Travel Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-white transition-colors">
                  Tour Catalog
                </Link>
              </li>
              <li>
                <Link to="/account/support" className="text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@travelbook.com" className="text-gray-400 hover:text-white transition-colors">
                  support@travelbook.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & More */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal & More</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>&copy; {currentYear} TravelBook. All rights reserved.</p>
            <p>Built with security and trust in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
