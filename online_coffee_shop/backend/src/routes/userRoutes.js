import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

/**
 * =====================
 * PUBLIC ROUTES (No authentication required)
 * =====================
 */

// POST /api/user/register
// Register new user with email and password
router.post('/register', registerUser);

// POST /api/user/login
// Login and get JWT token
router.post('/login', loginUser);

/**
 * =====================
 * PROTECTED ROUTES (Authentication required)
 * =====================
 */

// GET /api/user/profile
// Get current logged-in user's profile
// Requires: Valid JWT token in Authorization header
router.get('/profile', protect, getUserProfile);

// PUT /api/user/profile
// Update current user's profile (name)
// Requires: Valid JWT token in Authorization header
router.put('/profile', protect, updateUserProfile);

export default router;
