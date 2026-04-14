import Order from '../models/Order.js';

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
 * Body: { status: 'confirmed' | 'preparing' | 'ready' | 'completed' }
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, actualDelivery: status === 'completed' ? new Date() : null },
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

    const pending = await Order.countDocuments({ userId, status: 'pending' });
    const confirmed = await Order.countDocuments({ userId, status: 'confirmed' });
    const preparing = await Order.countDocuments({ userId, status: 'preparing' });
    const completed = await Order.countDocuments({ userId, status: 'completed' });
    const cancelled = await Order.countDocuments({
      userId,
      'cancellation.cancelled': true,
    });

    const totalSpent = await Order.aggregate([
      // eslint-disable-next-line no-undef
      { $match: { userId: require('mongoose').Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.status(200).json({
      pending,
      confirmed,
      preparing,
      completed,
      cancelled,
      totalSpent: totalSpent[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
