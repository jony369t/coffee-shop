import { useCart } from '../context/CartContext';
import { NavLink } from 'react-router';

/**
 * Shopping Cart Page
 * Features:
 * - Display all cart items
 * - Adjust quantities
 * - Remove items
 * - View totals
 * - Proceed to checkout
 * - Continue shopping button
 */
export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const TAX_RATE = 0.10; // 10%
  const DELIVERY_FEE = 5;

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-amber-100 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Looks like you haven't added any coffee yet!
            </p>
            <NavLink
              to="/menu"
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-900/50"
            >
              ☕ Browse Menu
            </NavLink>
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
          <h1 className="text-4xl font-black text-amber-100 mb-2">🛒 Shopping Cart</h1>
          <p className="text-gray-400">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-lg p-4 border border-amber-900/30 hover:border-amber-700/50 transition-all flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#0f0f0f] flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        ☕
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-100 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-amber-900/50 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-1 bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 font-bold"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 bg-[#252525] text-amber-100 font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400 mb-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </div>
                        <div className="text-lg font-bold text-amber-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold rounded-lg transition-all h-fit"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <NavLink
              to="/menu"
              className="mt-6 inline-block px-6 py-2 bg-[#252525] hover:bg-[#353535] text-amber-200 font-semibold rounded-lg transition-all"
            >
              ← Continue Shopping
            </NavLink>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg p-6 border border-amber-900/30 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-100 mb-6">Order Summary</h2>

              {/* Summary Details */}
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

              {/* Checkout Button */}
              <NavLink
                to="/checkout"
                className="w-full block text-center py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-900/50 mb-3"
              >
                Proceed to Checkout →
              </NavLink>

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear the cart?')) {
                    clearCart();
                  }
                }}
                className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-semibold rounded-lg transition-all"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
