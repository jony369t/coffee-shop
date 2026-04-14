# React AuthContext - Complete Implementation Guide

## What is AuthContext?

AuthContext is a **React Context** that manages user authentication globally. Instead of passing auth data through props (prop drilling), all components can access login, logout, and user data anywhere.

---

## 🎯 Problem It Solves

### Without AuthContext (Prop Drilling)
```javascript
// App → Navbar → Profile → ... → LogoutButton
// Pass user and logout through 10 levels of props!
<App user={user} logout={logout}>
  <Navbar user={user} logout={logout}>
    <Profile user={user} logout={logout}>
      <LogoutButton logout={logout} />
    </Profile>
  </Navbar>
</App>
```

### With AuthContext (Global Access)
```javascript
// Any component can directly access auth
const { user, logout } = useAuth()

// No prop drilling needed!
```

---

## 📁 Files Created

```
src/context/
├── AuthContext.jsx              # Auth state & functions
├── useAuth.js                   # Custom hook
├── AUTH_SETUP_GUIDE.md          # Setup instructions
├── EXAMPLE_COMPONENTS.md        # Example implementations
└── main.jsx.example             # Main.jsx setup example
```

---

## 🔧 How It Works - 3 Steps

### Step 1: Provider at Root
```javascript
// main.jsx
<AuthProvider>
  <App />
</AuthProvider>
```

### Step 2: Use Hook in Component
```javascript
// Any component
const { user, token, login, logout } = useAuth()
```

### Step 3: Access Anywhere
```javascript
// Use auth in component
if (user) {
  return <h1>Welcome {user.name}</h1>
}
```

---

## 📦 What AuthContext Provides

### State
```javascript
user          // { id, name, email, role }
token         // JWT string for API calls
isLoading     // true/false while loading
isAuthenticated // true if logged in, false otherwise
```

### Functions
```javascript
login(email, password)        // Login with credentials
register(name, email, password) // Sign up for new account
logout()                      // Logout and clear all data
```

---

## 🔐 Authentication Flow

```
User visits site
     ↓
AuthContext loads from localStorage (if exists)
     ↓
isLoading = true while checking
     ↓
Components show loading state
     ↓
Auth check complete, isLoading = false
     ↓
Components render based on isAuthenticated

---

User submits login form
     ↓
login(email, password) called
     ↓
API call to backend
     ↓
Backend validates + returns token
     ↓
Token stored in state { token }
     ↓
Token stored in localStorage
     ↓
Components access token via useAuth()
     ↓
User is logged in!

---

User clicks logout
     ↓
logout() function called
     ↓
State cleared: { user: null, token: null }
     ↓
localStorage cleared
     ↓
Components re-render
     ↓
Protected routes redirect to login
     ↓
User is logged out!
```

---

## 💾 localStorage Details

### What Gets Saved
```javascript
localStorage.setItem('authToken', token)        // JWT token
localStorage.setItem('authUser', JSON.stringify(user)) // User object
```

### When Saved
- After successful login
- After successful registration

### When Cleared
- On logout
- Never automatically (user stays logged in forever)

### Why localStorage?
- ✅ Persists after browser closes
- ✅ User stays logged in for days/weeks
- ✅ Can survive page refresh
- ✅ Standard practice for React SPAs

---

## 🚀 Setup - 4 Easy Steps

### Step 1: Update main.jsx
```javascript
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

### Step 2: Create Login Page
```javascript
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { login } = useAuth()
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard')
    }
  }
  
  // ... form JSX
}
```

### Step 3: Create Protected Route
```javascript
import { useAuth } from '../context/useAuth'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return children
}
```

### Step 4: Use in Router
```javascript
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
<Route path="/login" element={<Login />} />
```

---

## 📝 Common Usage Patterns

### Pattern 1: Check Login Status
```javascript
const { isAuthenticated, isLoading } = useAuth()

if (isLoading) return <Loading />
if (!isAuthenticated) return <Navigate to="/login" />
```

### Pattern 2: Get User Info
```javascript
const { user } = useAuth()

return <h1>Hello, {user?.name}</h1>
```

### Pattern 3: Check Admin Role
```javascript
const { user } = useAuth()

if (user?.role !== 'admin') {
  return <Navigate to="/unauthorized" />
}
```

### Pattern 4: Use Token in API Call
```javascript
const { token } = useAuth()

const response = await fetch('/api/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Pattern 5: Logout Button
```javascript
const { logout } = useAuth()

return <button onClick={logout}>Logout</button>
```

### Pattern 6: Show/Hide Navigation
```javascript
const { isAuthenticated, user } = useAuth()

return (
  <>
    {isAuthenticated ? (
      <span>{user.name} <button onClick={logout}>Logout</button></span>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </>
)
```

---

## 🎨 Component Structure

```
main.jsx
 └─ AuthProvider
     └─ App.jsx
         ├─ Navbar (uses useAuth)
         ├─ PrivateRoute (uses useAuth)
         │   └─ Dashboard
         ├─ Login (uses useAuth)
         ├─ Profile (uses useAuth)
         └─ AdminRoute (uses useAuth)
             └─ AdminPanel
```

---

## 🔒 Security Checklist

✅ **DO:**
- Include token in Authorization header
- Clear token on logout
- Redirect to login if no token
- Check role on backend (not just frontend)
- Use HTTPS in production
- Never store password

❌ **DON'T:**
- Trust frontend role check for security
- Store password in localStorage
- Use token without HTTPS
- Forget to clear localStorage on logout

---

## 🐛 Common Issues & Solutions

### Issue: "useAuth must be used within AuthProvider"
**Solution:** Wrap App with `<AuthProvider>` in main.jsx

### Issue: User lost on page refresh
**Solution:** Check localStorage isn't disabled
```javascript
if (isLoading) return <Loading />  // Wait for load
```

### Issue: API returns 401
**Problem:** Token not sent

**Solution:** Include token in headers
```javascript
headers: { 'Authorization': `Bearer ${token}` }
```

### Issue: Logout doesn't work
**Solution:** Make sure using logout() from useAuth
```javascript
const { logout } = useAuth()
button.onClick = logout
```

### Issue: Token stays in localStorage after logout
**Solution:** logout() should clear it
```javascript
const logout = () => {
  localStorage.removeItem('authToken')
  setToken(null)
}
```

---

## 📊 State Management Summary

```
Initial State (No Login):
{
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false
}

After Login:
{
  user: { id, name, email, role },
  token: "eyJhbGci...",
  isLoading: false,
  isAuthenticated: true
}

After Logout:
{
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false
}

After Page Refresh (if token in localStorage):
{
  user: { id, name, email, role },  // Loaded from localStorage
  token: "eyJhbGci...",              // Loaded from localStorage
  isLoading: false,
  isAuthenticated: true
}
```

---

## 🎯 Next Steps

1. ✅ Copy `AuthContext.jsx` to `src/context/`
2. ✅ Copy `useAuth.js` to `src/context/`
3. ⭕ Update `main.jsx` to wrap App with AuthProvider
4. ⭕ Create Login component using useAuth()
5. ⭕ Create ProtectedRoute component
6. ⭕ Update routes to use ProtectedRoute
7. ⭕ Add logout button to Navbar
8. ⭕ Test login flow
9. ⭕ Test localStorage persistence
10. ⭕ Test protected routes

---

## 📚 Files Reference

| File | Purpose | Usage |
|------|---------|-------|
| AuthContext.jsx | State + functions | Provider in main.jsx |
| useAuth.js | Custom hook | Import in components |
| AUTH_SETUP_GUIDE.md | Detailed guide | Reference |
| EXAMPLE_COMPONENTS.md | Code examples | Copy & adapt |

---

## 🚀 You're Ready!

Your AuthContext is set up and ready to use:
- ✅ Global auth state
- ✅ Login/logout functions
- ✅ Token persistence
- ✅ Protected routes
- ✅ Easy to use hook

Time to integrate with your React components! 🎉
