# React AuthContext - Global Authentication State Management

## Overview
AuthContext manages user authentication globally in React. Instead of passing auth data through props, all components can access login/logout and user data.

---

## 🏗️ Architecture

```
App.jsx
 ├─ AuthProvider (wraps entire app)
 │   ├─ Navbar (uses useAuth)
 │   ├─ Login (uses useAuth)
 │   ├─ Profile (uses useAuth)
 │   └─ PrivateRoute (uses useAuth)
 └─ Any component can access auth
```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| [src/context/AuthContext.jsx](src/context/AuthContext.jsx) | AuthContext + AuthProvider |
| [src/context/useAuth.js](src/context/useAuth.js) | Custom hook for easy access |

---

## 🚀 Setup Instructions

### Step 1: Wrap App with AuthProvider

**Update `src/main.jsx`:**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

**Key Points:**
- Wrap `<App />` with `<AuthProvider>`
- This makes auth available to all components
- Must be done at root level

### Step 2: Use Auth in Components

Import the `useAuth` hook in any component:

```javascript
import { useAuth } from '../context/useAuth.js'

export default function MyComponent() {
  const { user, token, login, logout } = useAuth()
  
  // Now use auth data
}
```

---

## 🔐 AuthContext State & Functions

### State
```javascript
user            // Object with user info: { id, name, email, role }
token           // JWT token for API calls
isLoading       // Boolean: is auth loading?
isAuthenticated // Boolean: is user logged in?
```

### Functions
```javascript
login(email, password)      // Login with credentials
register(name, email, pass) // Sign up for new account
logout()                    // Logout user
```

---

## 📝 Example: Login Component

```javascript
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // Call login function from context
    const result = await login(email, password)

    if (!result.success) {
      setError(result.message)
    } else {
      // Login successful, redirect to dashboard
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

---

## 👤 Example: User Profile Component

```javascript
import { useAuth } from '../context/useAuth'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  // Wait for auth to load
  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}
```

---

## 🔒 Example: Protected Route Component

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading while checking auth
  if (isLoading) {
    return <p>Loading...</p>
  }

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If logged in, show component
  return children
}

// Usage in router:
// <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

---

## 👮 Example: Admin-Only Route

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p>Loading...</p>
  }

  // Check if user exists and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Usage:
// <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
```

---

## 📡 Example: Making API Calls with Token

```javascript
import { useAuth } from '../context/useAuth'

export default function ProfileEditor() {
  const { user, token } = useAuth()
  const [name, setName] = useState(user.name)

  const updateProfile = async () => {
    // Use token in Authorization header
    const response = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Add token here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    const data = await response.json()
    if (data.success) {
      alert('Profile updated!')
    }
  }

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={updateProfile}>Update</button>
    </>
  )
}
```

---

## 🛠️ Example: Navbar with Login/Logout

```javascript
import { useAuth } from '../context/useAuth'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, token, logout } = useAuth()

  return (
    <nav>
      <div className="navbar-brand">
        <h1>Coffee Shop</h1>
      </div>

      <div className="navbar-menu">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>

        {/* Show if logged in */}
        {token ? (
          <>
            <Link to="/profile">{user?.name}</Link>
            {user?.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {/* Show if not logged in */}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
```

---

## 🔄 LocalStorage Persistence

### How It Works
```javascript
// On login, token is saved
localStorage.setItem('authToken', token)
localStorage.setItem('authUser', JSON.stringify(user))

// On page refresh
// AuthContext loads from localStorage automatically
const savedToken = localStorage.getItem('authToken')
```

### What This Means
- ✅ User stays logged in after browser closes
- ✅ Refresh page = user still logged in
- ✅ Close browser = user still logged in next visit
- ✅ Logout clears everything

---

## 🔐 Security Best Practices

### ✅ DO
```javascript
// ✅ Store token in localStorage (acceptable for SPA)
localStorage.setItem('authToken', token)

// ✅ Include token in API requests
headers: { 'Authorization': `Bearer ${token}` }

// ✅ Check user role on frontend (UX)
if (user.role === 'admin') { show admin link }

// ✅ Redirect to login if not authenticated
if (!token) { navigate('/login') }
```

### ❌ DON'T
```javascript
// ❌ Store password
localStorage.setItem('password', password)

// ❌ Trust frontend role check for security
// Always verify on backend!

// ❌ Store sensitive data
localStorage.setItem('creditCard', '1234-5678...')

// ❌ Use token after logout
logout()
const oldToken = localStorage.getItem('authToken') // Now null
```

---

## 📊 Complete Flow Diagram

```
User visits site
     ↓
AuthContext checks localStorage
     ↓
Token found? ─ YES → Load user data from localStorage
     │              Set isLoading = false
     ├─ NO → Set isLoading = false
     │       user = null, token = null
     ↓
Components can now access auth state

User clicks "Login"
     ↓
Pass email/password to login()
     ↓
API call to backend
     ↓
Backend returns token + user info
     ↓
Save to state { user, token }
     ↓
Save to localStorage
     ↓
Frontend updates
     ↓
User is logged in!

User clicks "Logout"
     ↓
logout() function called
     ↓
Clear state { user: null, token: null }
     ↓
Clear localStorage
     ↓
Redirect to login
     ↓
Page refresh checks localStorage
     ↓
No token → isAuthenticated = false
```

---

##  Component Usage Patterns

### Pattern 1: Check if Logged In
```javascript
const { isAuthenticated } = useAuth()

if (isAuthenticated) {
  return <Dashboard />
} else {
  return <Navigate to="/login" />
}
```

### Pattern 2: Get User Info
```javascript
const { user } = useAuth()

return <h1>Hello, {user?.name}</h1>
```

### Pattern 3: Admin Check
```javascript
const { user } = useAuth()

const isAdmin = user?.role === 'admin'

if (isAdmin) {
  return <AdminPanel />
}
```

### Pattern 4: Make API Call with Token
```javascript
const { token } = useAuth()

const data = await fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Pattern 5: Handle Loading State
```javascript
const { isLoading } = useAuth()

if (isLoading) {
  return <LoadingSpinner />
}

return <Dashboard />
```

---

## 🐛 Troubleshooting

### Error: "useAuth must be used within AuthProvider"
**Problem:** Using `useAuth()` outside `<AuthProvider>`

**Solution:** Wrap App with `<AuthProvider>` in `main.jsx`
```javascript
<AuthProvider>
  <App />
</AuthProvider>
```

### User Lost on Refresh
**Problem:** User data not persisting

**Solution:** Check localStorage is enabled and not cleared by browser

```javascript
// Check if loaded
const { isLoading } = useAuth()
if (isLoading) return <Loading />
```

### Token Not Sent with API Call
**Problem:** API returns 401 Unauthorized

**Solution:** Make sure token is included in headers
```javascript
// ✅ CORRECT
headers: { 'Authorization': `Bearer ${token}` }

// ❌ WRONG
headers: { 'Authorization': token }
```

### Logout Not Working
**Problem:** User still shows after logout

**Solution:** Make sure you're using the `logout` function
```javascript
// ✅ CORRECT
const { logout } = useAuth()
button.onClick = logout

// ❌ WRONG
localStorage.removeItem only
```

---

## Integration Checklist

- [ ] Copy `AuthContext.jsx` to `src/context/`
- [ ] Copy `useAuth.js` to `src/context/`
- [ ] Wrap `<App>` with `<AuthProvider>` in `main.jsx`
- [ ] Create Login component using `useAuth()`
- [ ] Create PrivateRoute component
- [ ] Update Navbar with login/logout
- [ ] Test login flow
- [ ] Test localStorage persistence
- [ ] Test logout
- [ ] Test protected routes

---

## Example File Structure
```
src/
├── context/
│   ├── AuthContext.jsx      ← Auth state management
│   └── useAuth.js           ← Custom hook
├── pages/
│   ├── Login.jsx            ← Uses useAuth()
│   ├── Profile.jsx          ← Uses useAuth()
│   └── Dashboard.jsx        ← Protected route
├── component/
│   ├── Navbar.jsx           ← Uses useAuth()
│   ├── PrivateRoute.jsx     ← Uses useAuth()
│   └── AdminRoute.jsx       ← Uses useAuth()
├── App.jsx
└── main.jsx                 ← Wrap with AuthProvider
```

---

## Next Steps

1. **Setup AuthProvider** in `main.jsx`
2. **Create Login page** using `useAuth()`
3. **Create Protected Routes** to guard pages
4. **Add Logout button** in Navbar
5. **Test login flow** end-to-end
6. **Test localStorage** persistence
7. **Secure API calls** with token
8. **Create Admin routes** for admin users
