import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getOrderHistory,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (requires authentication)
router.post('/', protect, createOrder); // Create order
router.get('/', protect, getUserOrders); // Get all user orders
router.get('/stats', protect, getOrderStats); // Get order statistics
router.get('/history/stats', protect, getOrderHistory); // Get order history
router.get('/:orderId', protect, getOrderById); // Get single order
router.put('/:orderId/cancel', protect, cancelOrder); // Cancel order

// Admin routes (requires admin role)
router.put('/:orderId/status', protect, adminOnly, updateOrderStatus); // Update order status

export default router;
