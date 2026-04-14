# Coffee Shop Backend

Express.js backend server for the Coffee Shop MERN application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Update `.env` file with your MongoDB URI and other settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coffee_shop
NODE_ENV=development
```

### 3. Start the Server
- **Development** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### User Authentication (Public)
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login and get JWT token

### User Profile (Protected - Login Required)
- `GET /api/user/profile` - Get current user's profile
- `PUT /api/user/profile` - Update user's profile

### Admin Dashboard (Admin-Only)
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users in system
- `DELETE /api/admin/users/:id` - Delete a user

### Product Management (Admin-Only)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── jwt.js                # JWT token utilities
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── userController.js     # User auth (register, login, profile)
│   │   └── adminController.js    # Admin functions
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js         # User auth routes
│   │   └── adminRoutes.js        # Admin-only routes
│   ├── middleware/
│   │   └── auth.js               # protect, adminOnly
│   └── index.js                  # Main server file
├── .env                          # Environment variables (JWT_SECRET, etc.)
├── .gitignore
└── package.json
```

## Documentation Files
- `JWT_AUTHENTICATION_GUIDE.md` - JWT setup & usage
- `PROTECTED_ROUTES_GUIDE.md` - Protected routes explained
- `ADMIN_ROUTES_GUIDE.md` - Admin-only routes explained
- `PRODUCT_MODEL_GUIDE.md` - Product schema design
- `PRODUCT_MANAGEMENT_API.md` - Product management endpoints

## Key Features Implemented
✅ Express.js server with MongoDB integration
✅ User authentication with JWT tokens
✅ Role-based access control (User vs Admin)
✅ Protected routes for authenticated users
✅ Admin-only routes for system management
✅ Password hashing with bcrypt
✅ Error handling and validation

## Middleware
- `protect` - Verifies JWT token and extracts user info
- `adminOnly` - Checks if user has admin role

## Authentication Flow
1. User registers → Password hashed → Stored in DB
2. User logs in → Credentials verified → JWT token returned
3. User makes request → Token in Authorization header
4. protect middleware validates token → Extracts user info
5. Route handler accesses `req.user`
6. adminOnly middleware checks role → Admin routes execute only for admins

## Next Steps
- Create more models (Order, Cart, Review, etc.)
- Add product management routes (create, update, delete)
- Implement order processing
- Add payment integration
- Setup email notifications
- Connect frontend to backend
- Deploy to production
