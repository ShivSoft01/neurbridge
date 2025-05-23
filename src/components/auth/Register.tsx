import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../theme';

type UserType = 'student' | 'teacher';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password, userType);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account');
      console.error(err);
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
        <p className="mt-2 text-gray-600 italic">"Join the future of learning"</p>
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
              <p className="mt-2 text-gray-600">"Education is the key to unlocking potential"</p>
            </div>
          </div>

          {/* Middle - Registration Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                      userType === 'student'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('teacher')}
                    className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                      userType === 'teacher'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    Teacher
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Right Side - Games */}
          <div className="hidden md:block transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <span className="text-6xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Learning Games</h3>
              <p className="mt-2 text-gray-600">"Learning through play is the best way to grow"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 