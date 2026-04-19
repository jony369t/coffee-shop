import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { formatUSDToBDT } from '../utils/currencyFormatter';

/**
 * Checkout Page
 * Features:
 * - Delivery address form
 * - Payment method selector
 * - Order summary
 * - Place order with API integration
 * - Order creation in database
 */
export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'credit_card',
    specialNotes: '',
  });

  const TAX_RATE = 0.10; // 10%
  const DELIVERY_FEE = 5;

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  const API_URL = 'http://localhost:5000/api';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.street.trim()) {
      setError('Street address is required');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.postalCode.trim()) {
      setError('Postal code is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (cart.length === 0) {
      setError('Cart is empty');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');

      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        specialNotes: formData.specialNotes,
        totals: {
          subtotal,
          tax,
          deliveryFee: DELIVERY_FEE,
          totalPrice: total,
        },
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success - clear cart and redirect
      setSuccessMessage('✓ Order placed successfully!');
      clearCart();

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-amber-100 mb-4">Cart is Empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Add items to your cart before checkout.
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-900/50"
            >
              ☕ Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-amber-100 mb-2">📦 Checkout</h1>
          <p className="text-gray-400">Complete your order details</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-600 text-green-200 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 text-red-200 rounded-lg">
            ✕ {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg p-6 border border-amber-900/30">
                <h2 className="text-2xl font-bold text-amber-100 mb-4">Delivery Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-200 font-semibold mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-amber-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-200 font-semibold mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full px-4 py-2 bg-[#0f0f0f] border border-amber-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-amber-200 font-semibold mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full px-4 py-2 bg-[#0f0f0f] border border-amber-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-700"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-amber-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg p-6 border border-amber-900/30">
                <h2 className="text-2xl font-bold text-amber-100 mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {[
                    { value: 'credit_card', label: '💳 Credit Card' },
                    { value: 'debit_card', label: '💳 Debit Card' },
                    { value: 'paypal', label: '🅿️ PayPal' },
                    { value: 'cash', label: '💵 Cash on Delivery' },
                  ].map((method) => (
                    <div key={method.value} className="flex items-center">
                      <input
                        type="radio"
                        id={method.value}
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-amber-700"
                      />
                      <label
                        htmlFor={method.value}
                        className="ml-3 text-amber-200 font-semibold cursor-pointer"
                      >
                        {method.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg p-6 border border-amber-900/30">
                <h2 className="text-2xl font-bold text-amber-100 mb-4">Special Notes</h2>

                <textarea
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                  placeholder="Add any special delivery instructions or notes for your order..."
                  rows="4"
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-amber-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-amber-900/50 disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Placing Order...
                  </span>
                ) : (
                  '✓ Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg p-6 border border-amber-900/30 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-100 mb-4">Order Summary</h2>

              {/* Items List */}
              <div className="mb-6 pb-6 border-b border-amber-900/30 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-400 mb-3">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatUSDToBDT(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-amber-900/30">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-xl">
                <span className="font-bold text-amber-100">Total</span>
                <span className="font-bold text-amber-400">${total.toFixed(2)}</span>
              </div>

              {/* Order Details */}
              <div className="bg-[#0f0f0f]/50 rounded-lg p-4 text-sm text-gray-400 space-y-2">
                <div>
                  <span className="text-amber-200 font-semibold">Estimated Delivery:</span>
                  <span className="block">45-60 minutes</span>
                </div>
                <div>
                  <span className="text-amber-200 font-semibold">Order Number:</span>
                  <span className="block">Will be assigned after order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
