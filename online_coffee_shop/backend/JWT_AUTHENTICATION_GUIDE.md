# JWT Authentication Setup Guide

## Overview
This guide explains how JWT authentication works in your Coffee Shop API.

## What is JWT?
**JWT (JSON Web Token)** is a secure way to verify user identity without storing session data.

Structure: `header.payload.signature`
- **Header:** Token type and algorithm
- **Payload:** User data (userId, email, role)
- **Signature:** Security hash (verifies token wasn't tampered with)

Example token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2NWUwZWM2YjEyMzQ1YiIsImVtYWlsIjoidXNlckBjb2ZmZWUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDkwNWJjfQ.
XkB2zx9_JvK1pL0qR3sT4uV5wX6yZ7aB8cD9eF0gH1
```

## Flow Diagram
```
1. USER SIGNUP/LOGIN
   POST /api/users/login { email, password }
           ↓
   Server verifies credentials
           ↓
   Generate JWT token with user data
           ↓
   Return token to client

2. PROTECTED REQUEST
   Client sends: Authorization: Bearer <token>
           ↓
   Server receives request
           ↓
   protect middleware extracts token
           ↓
   jwt.verify() validates token
           ↓
   Decode user data → req.user
           ↓
   Continue to route handler

3. ADMIN REQUEST
   Client sends: Authorization: Bearer <token>
           ↓
   protect middleware validates token
           ↓
   adminOnly middleware checks role
           ↓
   If role !== 'admin' → reject (403)
           ↓
   Otherwise → proceed
```

## Files Created

### 1. `/src/middleware/auth.js`
Contains two middleware functions:

#### `protect` Middleware
- **Purpose:** Verify JWT token and attach user to request
- **Steps:**
  1. Extract token from `Authorization: Bearer <token>` header
  2. Verify token signature hasn't been tampered with
  3. Check if token has expired
  4. Decode token to get user data (userId, email, role)
  5. Attach to `req.user`
  6. Call `next()` to proceed
- **On Error:** Return 401 Unauthorized

#### `adminOnly` Middleware
- **Purpose:** Check if user has admin role
- **Usage:** Apply AFTER protect middleware
- **On Error:** Return 403 Forbidden

### 2. `/src/config/jwt.js`
Helper functions for token operations:

#### `generateToken(userId, email, role)`
- **Purpose:** Create new JWT token during login
- **Expiration:** 7 days (configurable)
- **Returns:** Signed token string

#### `verifyToken(token)`
- **Purpose:** Manually verify token (optional)
- **Returns:** Decoded payload or null

### 3. `/.env` Updates
Added: `JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production`

**⚠️ Important:** Change this to a long, random string in production!
```bash
# Generate strong secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage Examples

### Example 1: Simple Route Protection
```javascript
import { protect } from '../middleware/auth.js';

// Only authenticated users can access this
router.get('/profile', protect, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    role: req.user.role,
  });
});
```

### Example 2: Admin-Only Route
```javascript
import { protect, adminOnly } from '../middleware/auth.js';

// Only admins can access this
router.delete('/users/:id', protect, adminOnly, (req, res) => {
  // Delete user logic
});
```

### Example 3: Using generateToken During Login
```javascript
import { generateToken } from '../config/jwt.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken(user._id, user.email, user.role);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
```

## How Client Uses Token

### 1. After Login - Store Token
```javascript
// Client-side (frontend)
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.token); // Store token
```

### 2. Send Token with Protected Requests
```javascript
// Client-side (frontend)
const token = localStorage.getItem('token');
const response = await fetch('/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`, // Add token to header
    'Content-Type': 'application/json',
  }
});
```

### 3. Server Receives and Validates
```
Client sends: Authorization: Bearer eyJhbGciOi...
         ↓
Server's protect middleware:
  1. Extracts: "eyJhbGciOi..." (removes "Bearer ")
  2. Verifies signature with JWT_SECRET
  3. Checks expiration
  4. Decodes: { userId, email, role }
  5. Sets: req.user = decoded
  6. Calls next()
         ↓
Route handler accesses req.user
```

## Token Lifecycle

| Event | Action |
|-------|--------|
| **User Login** | Generate token, send to client |
| **Client stores** | Save in localStorage/sessionStorage/cookie |
| **Each API call** | Include token in Authorization header |
| **Server validates** | Check signature, expiration, role |
| **Token expires** | After 7 days, client must login again |

## Security Best Practices

✅ **DO:**
- Use HTTPS in production (prevents token interception)
- Use long, random JWT_SECRET (minimum 32 characters)
- Set short expiration times (7-30 days)
- Store token securely on client
- Hash passwords with bcrypt
- Always verify token before accessing data

❌ **DON'T:**
- Store token in plain text
- Use weak JWT_SECRET
- Set very long expiration times
- Trust client-side role checks (always verify on server)
- Store sensitive data in token payload
- Hardcode JWT_SECRET in code

## Testing with Postman

### Step 1: Login
```
POST /api/users/login
Body (JSON):
{
  "email": "user@coffee.com",
  "password": "password123"
}
Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 2: Copy Token and Use in Protected Route
```
GET /api/users/profile
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "No token provided" | Missing Authorization header | Add token to headers |
| "Invalid token" | Token signature doesn't match | Check JWT_SECRET matches |
| "Token has expired" | Token older than 7 days | User must login again |
| "Admin privileges required" | User role is 'user' | Only admins can access |
| "Cannot read property 'role'" | protect middleware not applied | Check middleware is in route |

## Next Steps
1. Install dependencies: `npm install`
2. Create user controller with login/register
3. Implement password hashing with bcrypt
4. Test routes with Postman
5. Connect frontend to backend
