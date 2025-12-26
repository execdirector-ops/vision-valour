import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-900 w-16 h-16 rounded-xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Reset Password</h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-900 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-900 text-sm font-semibold">Password reset email sent!</p>
              <p className="text-green-800 text-sm mt-1">
                Check your inbox and follow the link to reset your password.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <Link
              to="/login"
              className="text-red-900 hover:text-red-800 font-semibold transition-colors block"
            >
              Back to Login
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 transition-colors block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
