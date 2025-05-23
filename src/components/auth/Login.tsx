import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      // Redirect to the page they tried to visit or home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold text-indigo-600 transform hover:scale-105 transition-transform duration-300">
          NeuroBridge
        </h1>
        <p className="mt-2 text-gray-600 italic">"Bridging minds, building futures"</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Side - AI Teacher */}
          <div className="hidden md:block transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <span className="text-6xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Teacher</h3>
              <p className="mt-2 text-gray-600">"Learning is a journey, not a destination"</p>
            </div>
          </div>

          {/* Middle - Login Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <p className="mt-4 text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Student */}
          <div className="hidden md:block transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <span className="text-6xl">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Student</h3>
              <p className="mt-2 text-gray-600">"Every day is a new opportunity to learn"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 