# Admin-Only Routes Implementation

## Overview
Admin-only routes are endpoints that **only admins can access**. They perform sensitive operations like managing users and viewing system statistics.

---

## How Admin Protection Works

```
REQUEST ARRIVES
     ↓
protect middleware
  ├─ Check Authorization header
  ├─ Verify JWT token
  ├─ Check expiration
  └─ Decode user → req.user
     ↓
adminOnly middleware
  ├─ Check req.user.role
  ├─ If role !== 'admin' → 403 Forbidden
  └─ If role === 'admin' → continue
     ↓
Route handler executes
     ↓
RESPONSE SENT
```

---

## System Flow

```
                    ┌─ No token? → 401 Unauthorized
                    │
Client sends token  ├─ Invalid? → 401 Unauthorized
       ↓            │
    protect         ├─ Expired? → 401 Unauthorized
    middleware      │
       ↓            └─ Valid? → Decode user
   Extract token         ↓
   Verify signature    Is admin?
       ↓               ├─ NO → 403 Forbidden
   req.user set       └─ YES → Continue
       ↓                   ↓
   adminOnly          Route handler
   middleware         executes
```

---

## Admin Routes Created

### 1. GET /api/admin/dashboard
**Purpose:** Returns admin dashboard statistics

**Authentication:** ✅ Requires valid admin token

**Response (200 OK):**
```json
{
  "success": true,
  "dashboard": {
    "totalUsers": 15,
    "totalProducts": 45,
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@coffee.com",
      "role": "admin"
    }
  }
}
```

**What it does:**
- Counts total users in system
- Counts total products in system
- Returns admin's own information

**Use case:** Admin panel shows system overview

---

### 2. GET /api/admin/users
**Purpose:** List all users in the system

**Authentication:** ✅ Requires valid admin token

**Response (200 OK):**
```json
{
  "success": true,
  "total": 3,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@coffee.com",
      "role": "user",
      "createdAt": "2024-03-20T10:30:00Z"
    },
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Jane Smith",
      "email": "jane@coffee.com",
      "role": "user",
      "createdAt": "2024-03-21T14:15:00Z"
    }
  ]
}
```

**What it does:**
- Fetches all users from database
- Excludes password hashes
- Returns complete user list

**Use case:** Admin manages user list, views user details

---

### 3. DELETE /api/admin/users/:id
**Purpose:** Delete a specific user by ID

**Authentication:** ✅ Requires valid admin token

**Parameters:** 
- `id` - User's MongoDB ID (in URL path)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User john@coffee.com deleted successfully",
  "deletedUser": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@coffee.com",
    "role": "user"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Safety Features:**
- Cannot delete own account (prevents accidental lockout)
- Validates user ID exists before deletion
- Returns confirmation of deleted user

**Use case:** Admin removes problematic or inactive users

---

## Middleware Chain Explanation

Every admin route uses this middleware stack:

```javascript
router.get('/dashboard', protect, adminOnly, getAdminDashboard);
                       ↑        ↑           ↑
                       │        │           │
                   Step 1   Step 2       Step 3
```

### Step 1: `protect` Middleware
```javascript
// Verifies JWT token is valid and not expired
// Sets req.user with decoded token data

export const protect = (req, res, next) => {
  const token = authHeader.slice(7);              // Extract token
  const decoded = jwt.verify(token, JWT_SECRET);  // Verify
  req.user = decoded;                             // Set user
  next();                                          // Continue
};
```

### Step 2: `adminOnly` Middleware
```javascript
// Checks if user has admin role
// If not admin, rejects request

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();  // User is admin, continue
};
```

### Step 3: Route Handler
```javascript
// Only runs if both middleware allow access
export const getAdminDashboard = async (req, res) => {
  // req.user is guaranteed to exist (protect ran)
  // req.user.role is guaranteed to be 'admin' (adminOnly ran)
  const { userId, email, role } = req.user;
  // ... execute logic ...
};
```

---

## Error Scenarios

### Scenario 1: No Token
```bash
GET /api/admin/dashboard
(No Authorization header)
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

**Why:** `protect` middleware rejects request

---

### Scenario 2: Invalid Token
```bash
GET /api/admin/dashboard
Authorization: Bearer invalid_xyz_token
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

**Why:** `protect` middleware's jwt.verify() fails

---

### Scenario 3: Token Expired
```bash
GET /api/admin/dashboard
Authorization: Bearer eyJhbGci... (created 8 days ago)
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

**Why:** `protect` middleware checks expiration (7 days)

---

### Scenario 4: User (Not Admin)
```bash
GET /api/admin/dashboard
Authorization: Bearer eyJhbGci... (valid token)
User role: "user" (NOT admin)
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**Why:** `adminOnly` middleware checks role

---

### Scenario 5: Success (Admin)
```bash
GET /api/admin/dashboard
Authorization: Bearer eyJhbGci... (valid admin token)
User role: "admin"
```

**Response (200 OK):**
```json
{
  "success": true,
  "dashboard": { ... }
}
```

**Why:** Both middleware allow access

---

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── adminController.js          ← NEW
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js              ← NEW
│   ├── middleware/
│   │   └── auth.js
│   └── index.js                        ← UPDATED
├── .env
└── package.json
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/admin/dashboard | ✅ Admin | Dashboard stats |
| GET | /api/admin/users | ✅ Admin | List all users |
| DELETE | /api/admin/users/:id | ✅ Admin | Delete user |

---

## Testing in Postman

### Setup: Create Admin User (First Time)
```
Manual DB Insert:
db.users.insertOne({
  name: "Admin",
  email: "admin@coffee.com",
  password: "hashed...",
  role: "admin"
})
```

### Step 1: Login as Admin
```
Method: POST
URL: http://localhost:5000/api/user/login
Body (JSON):
{
  "email": "admin@coffee.com",
  "password": "password123"
}
```

**Response:** Copy the `token`

### Step 2: Get Dashboard
```
Method: GET
URL: http://localhost:5000/api/admin/dashboard
Headers:
  Authorization: Bearer <paste_token_here>
```

### Step 3: Get All Users
```
Method: GET
URL: http://localhost:5000/api/admin/users
Headers:
  Authorization: Bearer <paste_token_here>
```

### Step 4: Delete User
```
Method: DELETE
URL: http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011
Headers:
  Authorization: Bearer <paste_token_here>
```

---

## Security Features

### ✅ Protection Mechanisms
1. **JWT Token Verification** - Ensures user is authenticated
2. **Role-Based Access** - Only admins can access
3. **Token Expiration** - Forces re-login after 7 days
4. **Self-Deletion Prevention** - Admin can't delete own account
5. **Password Excluded** - Never returns password hashes

### ✅ Safety Checks
```javascript
// Cannot delete own account
if (userId === req.user.userId.toString()) {
  return res.status(400).json({
    message: 'Cannot delete your own account'
  });
}

// Validates user exists
const deletedUser = await User.findByIdAndDelete(userId);
if (!deletedUser) {
  return res.status(404).json({
    message: 'User not found'
  });
}

// Exclude passwords from responses
const users = await User.find().select('-password');
```

---

## Creating Admin Users

### Method 1: Direct Database Insert
```javascript
// MongoDB shell
db.users.insertOne({
  name: "Admin",
  email: "admin@coffee.com",
  password: "hashed_password_here",
  role: "admin"
})
```

### Method 2: Via Code (One-time)
```javascript
// Create admin script
import bcrypt from 'bcrypt';
import User from './models/User.js';

const password = await bcrypt.hash('admin123', 10);
const admin = new User({
  name: 'Admin',
  email: 'admin@coffee.com',
  password,
  role: 'admin'
});
await admin.save();
console.log('Admin created');
```

---

## Complete Request/Response Examples

### Example 1: Get Dashboard
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "success": true,
  "dashboard": {
    "totalUsers": 5,
    "totalProducts": 12,
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin",
      "email": "admin@coffee.com",
      "role": "admin"
    }
  }
}
```

### Example 2: Get All Users
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "success": true,
  "total": 2,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin",
      "email": "admin@coffee.com",
      "role": "admin",
      "createdAt": "2024-03-20T10:00:00Z"
    },
    {
      "_id": "507f191e810c19729de860ea",
      "name": "John",
      "email": "john@coffee.com",
      "role": "user",
      "createdAt": "2024-03-21T14:00:00Z"
    }
  ]
}
```

### Example 3: Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/507f191e810c19729de860ea \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "success": true,
  "message": "User john@coffee.com deleted successfully",
  "deletedUser": {
    "id": "507f191e810c19729de860ea",
    "name": "John",
    "email": "john@coffee.com",
    "role": "user"
  }
}
```

---

## Admin Routes Checklist

- [x] Requires `protect` middleware (JWT verification)
- [x] Requires `adminOnly` middleware (role check)
- [x] Returns appropriate HTTP status codes
- [x] Handles errors gracefully
- [x] Excludes passwords from responses
- [x] Logs admin actions (optional)
- [x] Validates input data
- [x] Prevents self-deletion

---

## Next Steps

1. **Create admin user** in MongoDB
2. **Test login** to get token
3. **Test each admin route** with token
4. **Add logging** for audit trail
5. **Create more admin routes** (product management, order management)
6. **Setup frontend** to call admin endpoints
