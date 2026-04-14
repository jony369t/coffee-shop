import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    // Call login function from AuthContext
    const result = await login(formData.email, formData.password)

    if (result.success) {
      setSuccess('Login successful! Redirecting...')
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
          <p className="text-gray-400">Welcome back to your sanctuary</p>
        </div>

        {/* Login Card */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0f0f] border border-amber-900/50 cursor-pointer" />
                <span className="text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-900/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#252525] text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-4">
            <button className="py-2 px-4 bg-[#0f0f0f] border border-amber-900/30 hover:border-amber-700/50 rounded-lg text-white font-semibold transition-all hover:bg-[#1a1a1a]">
              Google
            </button>
            <button className="py-2 px-4 bg-[#0f0f0f] border border-amber-900/30 hover:border-amber-700/50 rounded-lg text-white font-semibold transition-all hover:bg-[#1a1a1a]">
              GitHub
            </button>
            <button className="py-2 px-4 bg-[#0f0f0f] border border-amber-900/30 hover:border-amber-700/50 rounded-lg text-white font-semibold transition-all hover:bg-[#1a1a1a]">
              Apple
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
