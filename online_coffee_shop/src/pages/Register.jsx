import React, { useState } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: true,
  })

  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'confirmPassword' || name === 'password') {
      const pwd = name === 'password' ? value : formData.password
      const confirmPwd = name === 'confirmPassword' ? value : formData.confirmPassword
      setPasswordMatch(pwd === confirmPwd)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (passwordMatch) {
      console.log('Registration:', formData)
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-amber-200 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-amber-200 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-amber-900/50 text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all"
                  required
                />
              </div>
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
                className={`w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border ${
                  passwordMatch ? 'border-amber-900/50' : 'border-red-900/50'
                } text-white placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/50 transition-all`}
                required
              />
              {!passwordMatch && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Newsletter Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-[#0f0f0f] border border-amber-900/50 cursor-pointer"
              />
              <span className="text-gray-400 text-sm">
                Subscribe to our newsletter for coffee tips and special offers
              </span>
            </label>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded bg-[#0f0f0f] border border-amber-900/50 cursor-pointer mt-0.5"
              />
              <span className="text-gray-400 text-sm">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!passwordMatch}
              className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg ${
                passwordMatch
                  ? 'bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white cursor-pointer hover:shadow-xl hover:shadow-amber-900/50'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in here
              </a>
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
