import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getAdminDashboard,
  getAllUsers,
  deleteUserByAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/adminController.js';

const router = express.Router();

/**
 * =====================
 * ADMIN-ONLY ROUTES
 * =====================
 * 
 * ALL routes require:
 * 1. Valid JWT token (protect middleware)
 * 2. User role === 'admin' (adminOnly middleware)
 * 
 * If either condition fails:
 * - No token → 401 Unauthorized
 * - Invalid token → 401 Unauthorized
 * - Token expired → 401 Unauthorized
 * - User role is 'user' → 403 Forbidden
 */

// GET /api/admin/dashboard
// Returns dashboard statistics for admin
// Usage: Show admin panel with user/product counts
router.get('/dashboard', protect, adminOnly, getAdminDashboard);

// GET /api/admin/users
// Returns list of all users in system
// Usage: Admin views all registered users
router.get('/users', protect, adminOnly, getAllUsers);

// DELETE /api/admin/users/:id
// Delete a specific user by ID
// Usage: Admin removes user from system
// Safety: Cannot delete own account
router.delete('/users/:id', protect, adminOnly, deleteUserByAdmin);

/**
 * =====================
 * PRODUCT MANAGEMENT ROUTES (Admin-Only)
 * =====================
 */

// POST /api/admin/products
// Add new product to menu
// Body: { name, description, price, category, image, stock, allergens, featured }
router.post('/products', protect, adminOnly, createProduct);

// PUT /api/admin/products/:id
// Update existing product
// Body: { name, description, price, category, image, stock, allergens, featured, available }
router.put('/products/:id', protect, adminOnly, updateProduct);

// DELETE /api/admin/products/:id
// Delete product from menu
router.delete('/products/:id', protect, adminOnly, deleteProduct);

export default router;
