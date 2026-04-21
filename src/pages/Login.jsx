import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('+250788');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(phone);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <Phone className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Enter your phone number to get started</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="sr-only">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 text-lg"
                placeholder="788 123 456"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Logging in...' : 'Continue'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            New to AgriPrice?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
