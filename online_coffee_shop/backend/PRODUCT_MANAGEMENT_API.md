# Product Management APIs for Admin

## Overview
Admin-only APIs for managing coffee shop products:
- ✅ **POST** - Add new product
- ✅ **PUT** - Update existing product
- ✅ **DELETE** - Remove product from menu

All routes require:
1. Valid JWT token (authentication)
2. Admin role (authorization)

---

## 🔐 Security & Middleware

### Middleware Chain
```javascript
router.post('/products', protect, adminOnly, createProduct);
                        ↑        ↑           ↑
                     Step 1   Step 2       Step 3
```

**Step 1: protect**
- Verifies JWT token in Authorization header
- Decodes user info → `req.user`
- Returns 401 if missing/invalid

**Step 2: adminOnly**
- Checks `req.user.role === 'admin'`
- Returns 403 if not admin

**Step 3: createProduct**
- Only runs if both middleware pass
- Executes product creation logic

---

## 📝 1. POST /api/admin/products - Create Product

### Purpose
Add a new product to the coffee shop menu

### Request
```bash
POST /api/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cappuccino",
  "description": "Smooth cappuccino with perfect espresso-to-milk ratio",
  "price": 4.99,
  "category": "espresso",
  "image": "https://cdn.coffeeshop.com/cappuccino.jpg",
  "stock": 0,
  "allergens": "Contains dairy",
  "featured": true
}
```

### Request Body Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **name** | String | ✅ Yes | Product name, must be unique |
| **description** | String | ✅ Yes | Detailed product info (100+ chars recommended) |
| **price** | Number | ✅ Yes | Must be ≥ 0 |
| **category** | String | ✅ Yes | Must be one of: espresso, cold-drinks, hot-drinks, pastries, merchandise |
| **image** | String | ❌ No | Product photo URL |
| **stock** | Number | ❌ No | Quantity (default: 0, 0 = unlimited for drinks) |
| **allergens** | String | ❌ No | Health/allergy info |
| **featured** | Boolean | ❌ No | Show on homepage (default: false) |

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Cappuccino",
    "description": "Smooth cappuccino with perfect espresso-to-milk ratio",
    "price": 4.99,
    "category": "espresso",
    "image": "https://cdn.coffeeshop.com/cappuccino.jpg",
    "stock": 0,
    "available": true,
    "featured": true,
    "allergens": "Contains dairy",
    "rating": 0,
    "reviews": 0,
    "createdAt": "2024-03-24T10:30:00Z",
    "updatedAt": "2024-03-24T10:30:00Z"
  }
}
```

### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
  "success": false,
  "message": "Please provide name, description, price, and category"
}
```

**400 Bad Request - Negative Price**
```json
{
  "success": false,
  "message": "Price cannot be negative"
}
```

**400 Bad Request - Invalid Category**
```json
{
  "success": false,
  "message": "Category must be one of: espresso, cold-drinks, hot-drinks, pastries, merchandise"
}
```

**400 Bad Request - Duplicate Product**
```json
{
  "success": false,
  "message": "Product \"Cappuccino\" already exists. Please use a different name."
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

**403 Forbidden - Not Admin**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## ✏️ 2. PUT /api/admin/products/:id - Update Product

### Purpose
Modify an existing product's information

### Request
```bash
PUT /api/admin/products/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 5.49,
  "stock": 15,
  "featured": false,
  "available": true
}
```

### URL Parameters
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| **id** | String | ✅ Yes | Product ID (MongoDB ObjectId) |

### Request Body
Any product fields can be updated. Only send fields you want to change:

```javascript
// Update only price
{ "price": 5.99 }

// Update multiple fields
{ "price": 5.99, "stock": 20, "featured": true }

// Update availability status
{ "available": false }

// Update all details
{
  "name": "New Name",
  "description": "New description",
  "price": 5.99,
  "category": "espresso",
  "image": "https://new-image.jpg",
  "stock": 20,
  "allergens": "New allergens",
  "featured": true,
  "available": true
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Cappuccino",
    "price": 5.49,          // Updated
    "stock": 15,            // Updated
    "featured": false,      // Updated
    "available": true,
    // ... other fields unchanged
    "updatedAt": "2024-03-24T15:45:00Z"
  }
}
```

### Common Update Scenarios

**Scenario 1: Change price**
```json
{ "price": 5.99 }
```

**Scenario 2: Update inventory**
```json
{ "stock": 25 }
```

**Scenario 3: Mark as featured**
```json
{ "featured": true }
```

**Scenario 4: Temporarily hide product**
```json
{ "available": false }
```

**Scenario 5: Add allergen information**
```json
{ "allergens": "Contains dairy, may contain nuts" }
```

### Error Responses

**400 Bad Request - Negative Price**
```json
{
  "success": false,
  "message": "Price cannot be negative"
}
```

**400 Bad Request - Invalid Category**
```json
{
  "success": false,
  "message": "Category must be one of: ..."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "message": "Error updating product",
  "error": "Description validation failed"
}
```

---

## 🗑️ 3. DELETE /api/admin/products/:id - Delete Product

### Purpose
Permanently remove a product from the menu

### Request
```bash
DELETE /api/admin/products/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
```

### URL Parameters
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| **id** | String | ✅ Yes | Product ID to delete |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Product \"Cappuccino\" deleted successfully",
  "product": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Cappuccino",
    "price": 4.99,
    "category": "espresso"
  }
}
```

### Error Responses

**404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## 🧪 Testing in Postman

### Step 1: Get Admin Token
```
POST http://localhost:5000/api/user/login

Body (JSON):
{
  "email": "admin@coffee.com",
  "password": "admin123"
}

Response: Copy the "token" value
```

### Step 2: Create Product
```
POST http://localhost:5000/api/admin/products

Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json

Body (JSON):
{
  "name": "Espresso",
  "description": "Single shot of rich, bold espresso",
  "price": 2.99,
  "category": "espresso",
  "image": "https://cdn.coffeeshop.com/espresso.jpg",
  "stock": 0,
  "allergens": null,
  "featured": false
}
```

### Step 3: Update Product
```
PUT http://localhost:5000/api/admin/products/<product_id>

Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json

Body (JSON):
{
  "price": 3.49,
  "featured": true
}
```

### Step 4: Delete Product
```
DELETE http://localhost:5000/api/admin/products/<product_id>

Headers:
  Authorization: Bearer <paste_token_here>
```

---

## 🔄 Complete Workflow Example

### Example: Managing Cappuccino

#### 1. Add Cappuccino
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cappuccino",
    "description": "Smooth cappuccino with microfoam",
    "price": 4.99,
    "category": "espresso",
    "image": "https://cdn.coffeeshop.com/cappuccino.jpg"
  }'

Response includes: "id": "507f1f77bcf86cd799439011"
```

#### 2. Make it Featured
```bash
curl -X PUT http://localhost:5000/api/admin/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{ "featured": true }'
```

#### 3. Increase Price
```bash
curl -X PUT http://localhost:5000/api/admin/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{ "price": 5.49 }'
```

#### 4. Temporarily Disable
```bash
curl -X PUT http://localhost:5000/api/admin/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{ "available": false }'
```

#### 5. Remove from Menu
```bash
curl -X DELETE http://localhost:5000/api/admin/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## 📋 Product Fields Reference

### All Editable Fields

| Field | Type | Constraints | Purpose |
|-------|------|-----------|---------|
| name | String | Max 255 chars | Product name |
| description | String | Max 1000 chars | Detailed info |
| price | Number | ≥ 0 | Product cost |
| category | String | Enum (5 values) | Product type |
| image | String | Valid URL | Product photo |
| stock | Number | ≥ 0 | Inventory count |
| available | Boolean | true/false | On/off status |
| featured | Boolean | true/false | Show on homepage |
| allergens | String | Max 255 chars | Health info |

### Auto-Generated Fields (Read-only)

| Field | Type | Set By | Purpose |
|-------|------|--------|---------|
| _id | ObjectId | MongoDB | Unique identifier |
| rating | Number | System | Average rating |
| reviews | Number | System | Review count |
| createdAt | Date | MongoDB | Creation time |
| updatedAt | Date | MongoDB | Last modified time |

---

## ✅ Valid Categories

When creating/updating, category must be one of:

```
"espresso"         - Espresso-based drinks
"cold-drinks"      - Iced beverages
"hot-drinks"       - Hot tea, chocolate
"pastries"         - Baked goods
"merchandise"      - Beans, mugs, etc.
```

---

## Input Validation Checklist

```
✅ Check: name not empty and unique
✅ Check: description not empty and detailed
✅ Check: price >= 0 (no negative prices)
✅ Check: category in enum list
✅ Check: image is valid URL (if provided)
✅ Check: stock >= 0 (no negative stock)
✅ Check: allergens has relevant info
✅ Check: featured only for sale items
```

---

## Error Handling Best Practices

```javascript
// Frontend should handle errors:

if (!response.ok) {
  const error = await response.json();
  console.log(error.message);
  
  // Common errors:
  // 401 → Ask user to login again
  // 403 → Show "Access Denied"
  // 404 → Show "Product not found"
  // 400 → Show validation error message
}
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/admin/products | Create product | ✅ Admin |
| PUT | /api/admin/products/:id | Update product | ✅ Admin |
| DELETE | /api/admin/products/:id | Delete product | ✅ Admin |

---

## Frontend Integration Example

### React Example: Create Product
```javascript
const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData)
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Product created:', data.product);
  } else {
    console.error(data.message);
  }
};

// Usage:
createProduct({
  name: 'Cappuccino',
  description: 'Smooth cappuccino...',
  price: 4.99,
  category: 'espresso'
});
```

---

## Security Considerations

✅ **DO:**
- Always verify token before processing
- Check admin role on every request
- Validate all input data
- Sanitize user input
- Use HTTPS in production
- Log admin actions for audit trail
- Prevent duplicate product names

❌ **DON'T:**
- Trust client-side validation only
- Bypass admin check
- Allow negative prices
- Store files in database
- Expose user IDs unnecessarily
- Skip input validation

---

## Next Steps

1. **Create product listing endpoint** (GET /api/products)
2. **Add product filtering** (category, price range)
3. **Implement search** (by name, description)
4. **Add review system** (customers rate products)
5. **Setup image uploads** (direct file upload)
6. **Add bulk operations** (create/update/delete multiple)
7. **Implement audit logging** (track admin changes)
8. **Add inventory alerts** (notify when stock low)
