import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Call register function from AuthContext
    const result = await register(formData.name, formData.email, formData.password)

    if (result.success) {
      setSuccess('Registration successful! Redirecting...')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-4xl font-black text-amber-100 mb-2">Coffee House</h1>
          <p className="text-gray-400">Join our coffee community</p>
        </div>

        {/* Register Card */}
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-2xl p-8 border border-amber-900/30 shadow-2xl hover:shadow-amber-900/30">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-700 text-green-200 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-amber-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-amber-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-amber-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-amber-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
