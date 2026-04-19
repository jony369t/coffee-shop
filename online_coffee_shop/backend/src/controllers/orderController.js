import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Create new order
 * POST /api/orders
 * Body: { items: [], deliveryAddress: {}, paymentMethod: '', specialNotes: '' }
 */
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, specialNotes } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Check stock availability for all items before creating order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productId}` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.subtotal || item.price * item.quantity;
    });

    const tax = subtotal * 0.1; // 10% tax
    const deliveryFee = 5; // Fixed delivery fee
    const totalPrice = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      userId,
      items,
      subtotal,
      tax,
      deliveryFee,
      totalPrice,
      deliveryAddress,
      paymentMethod: paymentMethod || 'credit_card',
      specialNotes,
      status: 'pending',
    });

    await order.save();

    // Decrement stock for all products in the order
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 * Protected route - returns all orders for logged-in user
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:orderId
 * Protected route - user can only see their own orders
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId).populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized - not your order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

/**
 * Cancel order
 * PUT /api/orders/:orderId/cancel
 * Only pending or confirmed orders can be cancelled
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized - not your order' });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore stock for all products in the cancelled order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    // Update order
    order.status = 'cancelled';
    order.cancellation = {
      cancelled: true,
      cancellationReason: reason || 'User requested cancellation',
      cancelledAt: new Date(),
      refundStatus: 'pending',
    };

    await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

/**
 * Update order status (admin only)
 * PUT /api/orders/:orderId/status
 * Body: { status: 'pending' | 'preparing' | 'on the way' | 'delivered' | 'cancelled' }
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        actualDelivery: status === 'delivered' ? new Date() : null 
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

/**
 * Get order history (for user dashboard)
 * GET /api/orders/history/stats
 * Returns completed and cancelled orders
 */
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const completed = await Order.find({
      userId,
      status: 'completed',
    }).sort({ createdAt: -1 });

    const cancelled = await Order.find({
      userId,
      'cancellation.cancelled': true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      totalCompleted: completed.length,
      totalCancelled: cancelled.length,
      completedOrders: completed,
      cancelledOrders: cancelled,
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};

/**
 * Get order statistics for user
 * GET /api/orders/stats
 */
export const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mongoose = require('mongoose');

    const pending = await Order.countDocuments({ userId, status: 'pending' });
    const preparing = await Order.countDocuments({ userId, status: 'preparing' });
    const onTheWay = await Order.countDocuments({ userId, status: 'on the way' });
    const delivered = await Order.countDocuments({ userId, status: 'delivered', userConfirmed: false });
    const confirmed = await Order.countDocuments({ userId, userConfirmed: true });
    const cancelled = await Order.countDocuments({ userId, status: 'cancelled' });

    const totalSpent = await Order.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(userId), 
          userConfirmed: true 
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.status(200).json({
      pending,
      preparing,
      onTheWay,
      delivered,
      confirmed,
      cancelled,
      totalSpent: totalSpent[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

/**
 * Get all orders (admin only)
 * GET /api/admin/orders
 * Returns all orders in the system with user info
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // Latest first

    // Format response to include user info at top level
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      userName: order.userId?.name || 'Unknown',
      userEmail: order.userId?.email || 'Unknown',
    }));

    res.status(200).json({
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

/**
 * Update order status (admin only)
 * PUT /api/admin/orders/:orderId
 * Body: { status: 'pending' | 'preparing' | 'on the way' | 'delivered' | 'cancelled' }
 */
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        actualDelivery: status === 'delivered' ? new Date() : null 
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        ...order.toObject(),
        userName: order.userId?.name || 'Unknown',
        userEmail: order.userId?.email || 'Unknown',
      },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

/**
 * User confirms delivery
 * PUT /api/orders/:orderId/confirm
 * User marks order as received/confirmed
 */
export const confirmDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized - not your order' });
    }

    // Only delivered orders can be confirmed
    if (order.status !== 'delivered') {
      return res.status(400).json({
        message: `Order must be in 'delivered' status. Current status: ${order.status}`,
      });
    }

    // Update order
    order.userConfirmed = true;
    order.confirmedAt = new Date();

    await order.save();

    res.status(200).json({
      message: 'Delivery confirmed successfully',
      order,
    });
  } catch (error) {
    console.error('Error confirming delivery:', error);
    res.status(500).json({ message: 'Error confirming delivery', error: error.message });
  }
};
