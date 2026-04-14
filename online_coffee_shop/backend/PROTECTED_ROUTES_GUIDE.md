# Protected User Routes Implementation

## Overview
This guide explains how to create and use protected routes that require user authentication.

## What is a Protected Route?
A **protected route** is an API endpoint that:
- ✅ Requires valid JWT token from user
- ✅ Only authenticated users can access
- ✅ Returns 401 error if token is missing/invalid
- ✅ Has access to user information via `req.user`

---

## Implementation Flow

### Step 1: User Login
```
POST /api/user/login
Body: { email: "user@coffee.com", password: "password123" }
         ↓
Server verifies credentials
         ↓
Generates JWT token
         ↓
Returns token to client
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@coffee.com",
    "role": "user"
  }
}
```

### Step 2: Access Protected Route
```
GET /api/user/profile
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         ↓
protect middleware extracts token
         ↓
Verifies token signature
         ↓
Checks expiration
         ↓
Decodes user info → req.user = { userId, email, role }
         ↓
Route handler executes
         ↓
Returns user profile
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@coffee.com",
    "role": "user",
    "createdAt": "2024-03-20T10:30:00Z",
    "updatedAt": "2024-03-23T15:45:00Z"
  }
}
```

---

## Key Files

### 1. `/src/controllers/userController.js`
Contains route handlers:

| Function | Route | Auth | Purpose |
|----------|-------|------|---------|
| `registerUser` | POST /register | ❌ No | Create new user account |
| `loginUser` | POST /login | ❌ No | Login and get token |
| `getUserProfile` | GET /profile | ✅ Yes | Get logged-in user's info |
| `updateUserProfile` | PUT /profile | ✅ Yes | Update user's name |

### 2. `/src/routes/userRoutes.js`
Defines routes with middleware:

```javascript
// PUBLIC
router.post('/register', registerUser);
router.post('/login', loginUser);

// PROTECTED (require auth)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
```

### 3. `/src/middleware/auth.js`
Authentication middleware:

```javascript
protect     // Verify JWT token, extract user info
adminOnly   // Check if user role is 'admin'
```

---

## How Protected Route Works

### Example: GET /api/user/profile

#### Route Definition
```javascript
router.get('/profile', protect, getUserProfile);
```

#### Middleware Chain
```
1. Client sends request with Authorization header
   └─ Authorization: Bearer <token>

2. protect middleware runs
   ├─ Extract token from header
   ├─ Verify signature (check secret key matches)
   ├─ Check expiration
   ├─ Decode → req.user = { userId, email, role }
   └─ Call next()

3. getUserProfile controller runs
   ├─ Access req.user (set by middleware)
   ├─ Fetch user from database
   ├─ Return user profile
   └─ Send response
```

### Controller Implementation
```javascript
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by protect middleware
    // Contains: { userId, email, role }

    // Fetch user from database
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user profile
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};
```

---

## HTTP Status Codes Explained

| Code | Meaning | When? |
|------|---------|-------|
| **200** | OK | Request successful |
| **201** | Created | New user registered |
| **400** | Bad Request | Invalid input (missing fields) |
| **401** | Unauthorized | No token or invalid token |
| **404** | Not Found | User not found in database |
| **500** | Server Error | Database or server error |

---

## Complete API Usage Example

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@coffee.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "John Doe", ... }
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@coffee.com",
    "password": "password123"
  }'
```

**Response:** Returns token

### 3. Access Protected Route (Using Token)
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@coffee.com",
    "role": "user",
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

### 4. Update Profile (Protected)
```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Jane Doe" }'
```

---

## Error Scenarios

### Scenario 1: No Token
```bash
GET /api/user/profile
(No Authorization header)
```

**Response (401):**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

### Scenario 2: Invalid Token
```bash
GET /api/user/profile
Authorization: Bearer invalid_token_xyz
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

### Scenario 3: Expired Token
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOi... (7+ days old)
```

**Response (401):**
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

### Scenario 4: Success
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOi... (valid, not expired)
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Important Security Notes

### ✅ DO
- **Always use HTTPS** in production (prevents token theft)
- **Hash passwords** before storing (using bcrypt)
- **Exclude password** from responses: `.select('-password')`
- **Verify token** on every protected route
- **Check expiration** before using token

### ❌ DON'T
- **Don't send password** in API response
- **Don't store token** in unencrypted storage
- **Don't trust client-side checks** (always verify on server)
- **Don't log sensitive data** like passwords or tokens
- **Don't use weak JWT_SECRET** (use strong random string)

---

## Postman Testing Steps

### Step 1: Register User
```
Method: POST
URL: http://localhost:5000/api/user/register
Headers: Content-Type: application/json
Body (JSON):
{
  "name": "Test User",
  "email": "test@coffee.com",
  "password": "password123"
}
```
Copy the `token` from response.

### Step 2: Use Token in Profile Route
```
Method: GET
URL: http://localhost:5000/api/user/profile
Headers:
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
```

Response will show user profile with all details.

### Step 3: Update Profile
```
Method: PUT
URL: http://localhost:5000/api/user/profile
Headers:
  Content-Type: application/json
  Authorization: Bearer <paste_token_here>
Body (JSON):
{
  "name": "Updated Name"
}
```

---

## Route Protection Checklist

When creating protected routes, ensure:

- [ ] Route has `protect` middleware
- [ ] Controller accesses `req.user`
- [ ] Database operations use `req.user.userId`
- [ ] Passwords excluded from responses
- [ ] Error handling for missing tokens
- [ ] Error handling for invalid tokens
- [ ] Error handling for database errors
- [ ] Appropriate HTTP status codes

---

## Files in This Implementation

```
backend/
├── src/
│   ├── controllers/
│   │   └── userController.js      ← Route handlers
│   ├── routes/
│   │   └── userRoutes.js          ← Route definitions
│   ├── middleware/
│   │   └── auth.js                ← protect middleware
│   ├── config/
│   │   └── jwt.js                 ← Token generation
│   └── index.js                   ← Register routes
├── .env                           ← JWT_SECRET
└── package.json                   ← Dependencies
```

---

## Next Steps

1. **Install dependencies:** `npm install`
2. **Test login endpoint** in Postman
3. **Copy token** from login response
4. **Test profile endpoint** with token
5. **Test without token** (should get 401 error)
6. **Create more protected routes** (orders, cart, etc.)
7. **Create admin routes** using `adminOnly` middleware
