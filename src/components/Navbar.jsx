import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Phone, LogIn, UserPlus, TrendingUp, Heart } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const auth = useAuth();
  const { user, logout } = auth || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    // Public navbar
    return (
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/eHAHIRO-logo.png" alt="eHAHIRO AgriPrice" className="h-12 w-auto flex-shrink-0" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden lg:inline">AgriPrice</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-all"
            >
              <LogIn size={16} className="inline mr-1" />
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <UserPlus size={16} className="inline mr-1" />
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated navbar
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/eHAHIRO-logo.png" alt="eHAHIRO AgriPrice" className="h-12 w-auto flex-shrink-0" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden lg:inline">AgriPrice</span>
          </Link>
            <Link to="/trends" className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200">
              <TrendingUp size={16} className="mr-1" />
              Trends
            </Link>
          <Link to="/subscriptions" className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-xl text-sm font-medium hover:bg-pink-200">
            <Heart size={16} className="mr-1" />
            Subscriptions
          </Link>
          {user.role === 'agent' && (
            <Link to="/agent" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200">
              Agent Dashboard
            </Link>
          )}
          {user.role === 'admin' && (
            <>
              <Link to="/admin" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-200">
                Admin Panel
              </Link>
              <Link to="/crops" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-200">
                Manage Crops
              </Link>
              <Link to="/markets" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-200">
                Manage Markets
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-full">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="font-medium text-sm">{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
