/**
 * Example 1: Login Component
 * Location: src/pages/Login.jsx
 * 
 * Shows how to use useAuth() for login
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Call login from AuthContext
    const result = await login(email, password)

    if (result.success) {
      // Login successful, redirect to dashboard
      navigate('/dashboard')
    } else {
      // Show error message
      setError(result.message)
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

---

/**
 * Example 2: Protected Route Component
 * Location: src/component/PrivateRoute.jsx
 * 
 * Only allows logged-in users to access
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // While checking auth, show loading
  if (isLoading) {
    return <div>Loading...</div>
  }

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If logged in, show the page
  return children
}

// Usage in Router.jsx:
// <Route 
//   path="/profile" 
//   element={<PrivateRoute><Profile /></PrivateRoute>} 
// />

---

/**
 * Example 3: Admin-Only Route Component
 * Location: src/component/AdminRoute.jsx
 * 
 * Only allows admin users to access
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Check if user exists and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Usage in Router.jsx:
// <Route 
//   path="/admin/dashboard" 
//   element={<AdminRoute><AdminDashboard /></AdminRoute>} 
// />

---

/**
 * Example 4: Profile Component
 * Location: src/pages/Profile.jsx
 * 
 * Shows logged-in user's profile
 */

import { useAuth } from '../context/useAuth'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

---

/**
 * Example 5: Navbar Component
 * Location: src/component/Navbar.jsx
 * 
 * Shows different menu based on login status
 */

import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, token, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>☕ Coffee Shop</h1>
      </div>

      <div className="navbar-menu">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>

        {/* If logged in */}
        {token ? (
          <>
            <span>Welcome, {user?.name}!</span>
            <Link to="/profile">Profile</Link>

            {/* If admin */}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard">Admin</Link>
            )}

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* If not logged in */}
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

---

/**
 * Example 6: Making API Calls with Token
 * Location: src/pages/ProductManager.jsx
 * 
 * Shows how to use token in API requests
 */

import { useState } from 'react'
import { useAuth } from '../context/useAuth'

export default function ProductManager() {
  const { token } = useAuth()
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const addProduct = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Make API call with token in Authorization header
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // ← Add token here
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          price: productPrice,
          description: 'Test product',
          category: 'espresso',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Product added successfully!')
        setProductName('')
        setProductPrice('')
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-manager">
      <h2>Add Product</h2>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product name"
      />
      <input
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        placeholder="Price"
      />
      <button onClick={addProduct} disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

---

/**
 * Example 7: Register Component
 * Location: src/pages/Register.jsx
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await register(formData.name, formData.email, formData.password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
