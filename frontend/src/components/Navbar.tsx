import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              ✈
            </div>
            TravelHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition">
              Home
            </Link>
            <Link to="/flights" className="text-gray-600 hover:text-primary transition">
              Flights
            </Link>
            <Link to="/hotels" className="text-gray-600 hover:text-primary transition">
              Hotels
            </Link>
            <Link to="/tours" className="text-gray-600 hover:text-primary transition">
              Tours
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition">
                  {user?.full_name}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary transition">
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link to="/" className="block py-2 text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link to="/flights" className="block py-2 text-gray-600 hover:text-primary">
              Flights
            </Link>
            <Link to="/hotels" className="block py-2 text-gray-600 hover:text-primary">
              Hotels
            </Link>
            <Link to="/tours" className="block py-2 text-gray-600 hover:text-primary">
              Tours
            </Link>
            
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-gray-600 hover:text-primary">
                    Admin
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full mt-2"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
