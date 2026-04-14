import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

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
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'history', 'cancelled'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State management
  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
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
      // Fetch current orders
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ordersData = await ordersRes.json();
      
      // Separate current and history
      const current = ordersData.orders?.filter(
        (o) => !['completed', 'cancelled'].includes(o.status)
      ) || [];
      const completed = ordersData.orders?.filter((o) => o.status === 'completed') || [];
      const cancelled = ordersData.orders?.filter((o) => o.cancellation?.cancelled) || [];

      setCurrentOrders(current);
      setCompletedOrders(completed);
      setCancelledOrders(cancelled);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-info';
      case 'preparing':
        return 'badge-primary';
      case 'ready':
        return 'badge-success';
      case 'completed':
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
      case 'confirmed':
        return '✓';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '🎉';
      case 'completed':
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
        <span className={`badge ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)} {order.status}
        </span>
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
              ${(item.subtotal || item.quantity * item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-1 text-sm mb-3 bg-white rounded p-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%):</span>
          <span>${order.tax?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery:</span>
          <span>${order.deliveryFee?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
          <span>Total:</span>
          <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
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
      <div className="flex gap-2">
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
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-blue-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-purple-600">{stats.preparing}</div>
              <div className="text-sm text-gray-600">Preparing</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-bordered mb-6 bg-white rounded-lg p-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`tab tab-lg ${activeTab === 'current' ? 'tab-active' : ''}`}
          >
            📦 Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab tab-lg ${activeTab === 'history' ? 'tab-active' : ''}`}
          >
            ✅ Order History ({completedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`tab tab-lg ${activeTab === 'cancelled' ? 'tab-active' : ''}`}
          >
            ❌ Cancelled Orders ({cancelledOrders.length})
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Current Orders Tab */}
            {activeTab === 'current' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {currentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No current orders</p>
                    <button className="btn btn-primary mt-4">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div>
                    {currentOrders.map((order) => (
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

            {/* Order History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No completed orders yet</p>
                  </div>
                ) : (
                  <div>
                    {completedOrders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancelled Orders Tab */}
            {activeTab === 'cancelled' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {cancelledOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No cancelled orders</p>
                  </div>
                ) : (
                  <div>
                    {cancelledOrders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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
                          ${(item.subtotal || item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Total Amount</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    ${selectedOrder.totalPrice?.toFixed(2) || '0.00'}
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
