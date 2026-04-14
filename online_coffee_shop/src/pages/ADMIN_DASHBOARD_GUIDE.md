# Admin Dashboard Guide

## Overview

The Admin Dashboard is the main control center for coffee shop administrators. It provides complete management tools for users and products.

---

## Features

### 1. **Users Management**
- View all registered users
- See user details: name, email, role, join date
- Delete users from the system
- Role badges: distinguish between regular users and admins

### 2. **Products Management**
- View complete product inventory
- Add new products with full details
- Delete products
- See product status: price, stock, availability, rating

---

## Tab Structure

The dashboard has **2 main tabs**:

### **Tab 1: Users Management**
```
👥 Users Management
├── List all users
├── Display: Name, Email, Role, Joined Date
├── Delete button (disabled for current admin)
└── Refresh button to reload data
```

### **Tab 2: Products Management**
```
📦 Products Management
├── Add Product Form
│   ├── Name (required)
│   ├── Price (required)
│   ├── Category (dropdown)
│   ├── Stock (required)
│   ├── Description
│   ├── Image URL
│   ├── Allergens (comma-separated)
│   └── Available checkbox
├── Product Inventory Table
│   ├── Name, Price, Category
│   ├── Stock, Available Status
│   ├── Rating
│   └── Delete button
└── Refresh button to reload data
```

---

## Component Logic

### **State Management**
```javascript
// Active tab
const [activeTab, setActiveTab] = useState('users');

// Users
const [users, setUsers] = useState([]);
const [usersLoading, setUsersLoading] = useState(false);

// Products
const [products, setProducts] = useState([]);
const [showAddProductForm, setShowAddProductForm] = useState(false);
const [newProduct, setNewProduct] = useState({ /* fields */ });
```

### **API Helper Function**
```javascript
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ← Adds auth token
      ...options.headers,
    },
    ...options,
  });
  return await response.json();
};
```

**Why this pattern?**
- Automatically adds `Authorization: Bearer {token}` header to all requests
- Prevents repeating token logic in every API call
- Handles errors uniformly

---

## Users Management Flow

### **Fetch Users**
```javascript
const fetchUsers = async () => {
  try {
    const data = await apiCall('/admin/users'); // GET /api/admin/users
    setUsers(data.users);
  } catch (err) {
    setError('Failed to fetch users');
  }
};
```

**API Endpoint:** `GET /api/admin/users` (admin-only)

**Response:**
```json
{
  "users": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "admin123",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

### **Delete User**
```javascript
const deleteUser = async (userId) => {
  if (!window.confirm('Are you sure?')) return;
  
  try {
    await apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
    
    // Remove from UI
    setUsers(users.filter((u) => u._id !== userId));
    setSuccess('User deleted successfully');
  } catch (err) {
    setError('Failed to delete user');
  }
};
```

**API Endpoint:** `DELETE /api/admin/users/:id` (admin-only)

**Safety Features:**
- Confirmation dialog prevents accidental deletion
- Cannot delete yourself (button disabled)
- Success/error messages inform user

---

## Products Management Flow

### **Fetch Products**
```javascript
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    setProducts(data.products);
  } catch (err) {
    setError('Failed to fetch products');
  }
};
```

**API Endpoint:** `GET /api/products` (public endpoint)

**Note:** This is a public endpoint - no token needed. You could make it admin-only by protecting it.

### **Add Product**
```javascript
const handleAddProduct = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!newProduct.name || !newProduct.price) {
    setError('Fill all required fields');
    return;
  }
  
  try {
    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      allergens: newProduct.allergens.split(',').map(a => a.trim()),
    };
    
    const data = await apiCall('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    // Add to UI
    setProducts([...products, data.product]);
    setSuccess('Product added successfully');
    setShowAddProductForm(false);
  } catch (err) {
    setError('Failed to add product');
  }
};
```

**API Endpoint:** `POST /api/admin/products` (admin-only)

**Request Body:**
```json
{
  "name": "Espresso",
  "description": "Strong Italian coffee",
  "price": 3.50,
  "category": "espresso",
  "image": "https://...",
  "stock": 50,
  "available": true,
  "allergens": ["nuts", "dairy"]
}
```

**Data Transformations:**
- `price`: String → Number (parseFloat)
- `stock`: String → Number (parseInt)
- `allergens`: String → Array (split by comma, trim spaces)

### **Delete Product**
```javascript
const deleteProduct = async (productId) => {
  if (!window.confirm('Delete this product?')) return;
  
  try {
    await apiCall(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
    
    // Remove from UI
    setProducts(products.filter((p) => p._id !== productId));
    setSuccess('Product deleted successfully');
  } catch (err) {
    setError('Failed to delete product');
  }
};
```

**API Endpoint:** `DELETE /api/admin/products/:id` (admin-only)

---

## Loading & Error States

### **Loading Indicators**
```javascript
// While fetching users
{usersLoading ? (
  <div className="text-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
) : (
  // Show table
)}

// While adding product
<button disabled={loading}>
  {loading ? (
    <>
      <span className="loading loading-spinner loading-sm"></span>
      Adding...
    </>
  ) : (
    '✅ Add Product'
  )}
</button>
```

### **Error/Success Messages**
```javascript
{error && (
  <div className="alert alert-error">
    <span>{error}</span>
    <button onClick={() => setError('')}>✕</button>
  </div>
)}

{success && (
  <div className="alert alert-success">
    <span>{success}</span>
  </div>
)}
```

**Auto-dismiss:** Success messages disappear after 3 seconds
```javascript
setTimeout(() => setSuccess(''), 3000);
```

---

## Lifecycle & Side Effects

### **Fetch Data When Tab Changes**
```javascript
useEffect(() => {
  if (activeTab === 'users') {
    fetchUsers();
  } else if (activeTab === 'products') {
    fetchProducts();
  }
}, [activeTab]); // Re-run when activeTab changes
```

**Why this pattern?**
- Only fetch data when user actually clicks the tab
- Reduces unnecessary API calls
- Improves performance

---

## UI Components Used

- **DaisyUI Tabs:** `<div className="tabs">`
- **DaisyUI Buttons:** `<button className="btn btn-primary">`
- **DaisyUI Table:** `<table className="table table-zebra">`
- **DaisyUI Alerts:** `<div className="alert alert-success">`
- **DaisyUI Form Elements:** `<input className="input input-bordered">`
- **DaisyUI Loading:** `<span className="loading loading-spinner">`

---

## Security Considerations

### ✅ Frontend Protection
- Component only accessible to admins (via AdminRoute wrapper)
- API calls include Authorization token

### ⚠️ Backend is the Real Security Layer
- Backend middleware checks `token` validity
- Backend middleware checks `role === 'admin'`
- Backend validates all input data
- **Never trust frontend security alone**

### API Endpoints Protected By:
```javascript
// Backend route structure
app.delete('/api/admin/users/:id', protect, adminOnly, deleteUserByAdmin);
//                                     ↑       ↑
//                          verifyToken  checkRole
```

---

## How to Integrate into Router

```javascript
import { Route } from 'react-router-dom';
import AdminRoute from './component/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

<Route 
  path="/admin/dashboard" 
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } 
/>
```

**Result:**
- Non-logged-in users → Redirected to `/login`
- Regular users → Redirected to `/`
- Admin users → See AdminDashboard ✅

---

## Possible Enhancements

1. **Edit User Feature**
   - Change user role from user to admin
   - Update user email/name
   - API endpoint: `PUT /api/admin/users/:id`

2. **Edit Product Feature**
   - Update product details
   - API endpoint: `PUT /api/admin/products/:id`

3. **Search & Filter**
   - Search users by name/email
   - Filter products by category
   - Filter by stock availability

4. **Pagination**
   - Show 10 users per page
   - Navigate between pages
   - Reduces loading time for large datasets

5. **Export Data**
   - Download users as CSV
   - Download products as CSV
   - Generate reports

6. **Dashboard Stats**
   - Total users count
   - Total revenue
   - Best-selling products
   - Low stock alerts

---

## Troubleshooting

### **"401 Unauthorized" Error**
- **Problem:** Token expired or missing
- **Solution:** Logout and login again

### **"403 Forbidden" Error**
- **Problem:** User is not an admin
- **Solution:** Only admins can access this dashboard

### **Products/Users not loading**
- **Problem:** API server not running
- **Solution:** Start backend: `npm run dev` in backend folder

### **Form doesn't submit**
- **Problem:** Missing required fields
- **Solution:** Fill in Name, Price, and Stock fields (marked with *)

---

## Code Architecture

```
AdminDashboard.jsx
├── State (users, products, forms, loading, errors)
├── API Helpers (apiCall function)
├── Users Logic
│   ├── fetchUsers()
│   └── deleteUser()
├── Products Logic
│   ├── fetchProducts()
│   ├── handleAddProduct()
│   └── deleteProduct()
├── useEffect (fetch on tab change)
└── JSX Render
    ├── Header
    ├── Alert Messages
    ├── Tab Buttons
    ├── Users Tab Content
    └── Products Tab Content
```

---

## Testing Checklist

- [ ] Login as admin user
- [ ] Navigate to `/admin/dashboard`
- [ ] Users tab shows all users
- [ ] Can delete a regular user
- [ ] Cannot delete your own admin account
- [ ] Products tab shows all products
- [ ] Add new product with valid data
- [ ] Added product appears in table
- [ ] Delete product from inventory
- [ ] Success/error messages display
- [ ] Loading spinners show during API calls
- [ ] Token is sent with every request
