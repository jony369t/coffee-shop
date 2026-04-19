import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { formatUSDToBDT } from '../utils/currencyFormatter';

/**
 * User Dashboard
 * Features:
 * - View current orders (pending, confirmed, preparing, ready)
 * - View order history (completed orders)
 * - View cancelled orders
 * - Cancel orders
 * - Order tracking and status
 * - Order statistics
 */
export default function UserDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // Filter by individual status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State management
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Fetch all orders data
  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all orders
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ordersData = await ordersRes.json();
      
      // Store all orders
      setAllOrders(ordersData.orders || []);

      // Fetch statistics
      const statsRes = await fetch(`${API_URL}/orders/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by active tab status
  const getFilteredOrders = () => {
    if (activeTab === 'all') {
      return allOrders;
    }
    if (activeTab === 'confirmed') {
      return allOrders.filter((o) => o.userConfirmed);
    }
    return allOrders.filter((o) => o.status === activeTab);
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: 'User requested cancellation',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setSuccess('Order cancelled successfully');
      fetchOrdersData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelivery = async (orderId) => {
    if (!window.confirm('Confirm that you have received this order?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to confirm delivery');
      }

      setSuccess('Delivery confirmed! Thank you for your purchase.');
      fetchOrdersData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'preparing':
        return 'badge-info';
      case 'on the way':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'preparing':
        return '👨‍🍳';
      case 'on the way':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '•';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============ ORDER CARD COMPONENT ============
  const OrderCard = ({ order, canCancel = false }) => (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4 border-l-4 border-amber-600">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`badge ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)} {order.status}
          </span>
          {order.userConfirmed && (
            <span className="badge badge-success text-xs">✓ Confirmed</span>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded p-3 mb-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {item.productName || 'Product'} x {item.quantity}
            </span>
            <span className="text-gray-700 font-semibold">
              {formatUSDToBDT(item.subtotal || item.quantity * item.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-1 text-sm mb-3 bg-white rounded p-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>{formatUSDToBDT(order.subtotal || 0)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%):</span>
          <span>{formatUSDToBDT(order.tax || 0)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery:</span>
          <span>{formatUSDToBDT(order.deliveryFee || 0)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
          <span>Total:</span>
          <span>{formatUSDToBDT(order.totalPrice || 0)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="bg-white rounded p-3 mb-3 text-sm">
          <p className="font-semibold text-gray-700 mb-1">📍 Delivery Address:</p>
          <p className="text-gray-600">
            {order.deliveryAddress.street}
            <br />
            {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
            <br />
            Phone: {order.deliveryAddress.phone}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedOrder(order)}
          className="btn btn-sm btn-outline btn-primary"
        >
          View Details
        </button>
        {canCancel && (
          <button
            onClick={() => cancelOrder(order._id)}
            className="btn btn-sm btn-error"
          >
            Cancel Order
          </button>
        )}
        {order.status === 'delivered' && !order.userConfirmed && (
          <button
            onClick={() => confirmDelivery(order._id)}
            className="btn btn-sm btn-success"
          >
            ✓ Confirm Received
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}!</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error mb-4 shadow-lg">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="btn btn-sm btn-ghost"
            >
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-4 shadow-lg">
            <span>{success}</span>
          </div>
        )}

        {/* Statistics Cards */}
       

        {/* Tabs */}
        <div className="mb-6 bg-gray-50 rounded-lg p-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            📋 All ({allOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            ⏳ Pending ({allOrders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('preparing')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'preparing'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            👨‍🍳 Preparing ({allOrders.filter((o) => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setActiveTab('on the way')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'on the way'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            🚚 On the Way ({allOrders.filter((o) => o.status === 'on the way').length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            ✅ Delivered ({allOrders.filter((o) => o.status === 'delivered').length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'confirmed'
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            ✓ Confirmed ({allOrders.filter((o) => o.userConfirmed).length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            ❌ Cancelled ({allOrders.filter((o) => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {getFilteredOrders().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {activeTab === 'all' ? 'No orders yet' : `No orders with status: ${activeTab}`}
                </p>
                <button className="btn btn-primary mt-4">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                {getFilteredOrders().map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    canCancel={['pending', 'confirmed'].includes(order.status)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-ghost btn-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Status Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="badge badge-warning mr-2">Order Placed</span>
                      <span className="text-sm">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center">
                        <span className="badge badge-info mr-2">Confirmed</span>
                      </div>
                    )}
                    {['preparing', 'ready', 'completed'].includes(selectedOrder.status) && (
                      <div className="flex items-center">
                        <span className="badge badge-primary mr-2">Preparing</span>
                      </div>
                    )}
                    {selectedOrder.status === 'completed' && (
                      <div className="flex items-center">
                        <span className="badge badge-success mr-2">Completed</span>
                        <span className="text-sm">{formatDate(selectedOrder.actualDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Items</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-semibold">
                          {formatUSDToBDT(item.subtotal || item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Total Amount</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatUSDToBDT(selectedOrder.totalPrice || 0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-primary w-full mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
