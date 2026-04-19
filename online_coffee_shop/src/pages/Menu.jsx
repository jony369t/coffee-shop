import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatUSDToBDT } from '../utils/currencyFormatter';

/**
 * Menu Page
 * Features:
 * - Display all products from database
 * - Filter by category
 * - Add to cart with quantity selector
 * - Show product images
 * - Display ratings
 */
export default function Menu() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [quantities, setQuantities] = useState({});

  const API_URL = 'http://localhost:5000/api';

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data.products || []);
      
      // Initialize quantities
      const quantitiesObj = {};
      (data.products || []).forEach((p) => {
        quantitiesObj[p._id] = 1;
      });
      setQuantities(quantitiesObj);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    addToCart(product, quantity);
    
    // Show success message
    setSuccessMessage(`${product.name} x${quantity} added to cart!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset quantity
    setQuantities({ ...quantities, [product._id]: 1 });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity >= 1 && quantity <= 10) {
      setQuantities({ ...quantities, [productId]: quantity });
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-amber-100 mb-4">☕ Our Menu</h1>
          <p className="text-gray-400 text-lg">Freshly brewed coffee for every moment</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-600 text-green-200 rounded-lg">
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 text-red-200 rounded-lg">
            ✕ {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex justify-center gap-3 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-amber-700 text-white shadow-lg shadow-amber-900/50'
                  : 'bg-[#252525] text-amber-200 hover:bg-[#353535]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <span className="loading loading-spinner loading-lg text-amber-700"></span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] rounded-lg overflow-hidden border border-amber-900/30 hover:border-amber-700/50 transition-all shadow-lg hover:shadow-amber-900/30 hover:scale-105 duration-300 flex flex-col h-full"
              >
                {/* Product Image - 60-65% of card height */}
                <div className="h-[280px] bg-[#0f0f0f] overflow-hidden rounded-t-lg">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '☕';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-amber-900/20 to-black">
                      ☕
                    </div>
                  )}
                </div>

                {/* Product Info - Split LEFT & RIGHT */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* LEFT SIDE: Name, Description, Category, Stock */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      {/* Name */}
                      <h3 className="text-xl font-bold text-amber-100 mb-2">{product.name}</h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description || 'Premium coffee experience'}
                      </p>

                      {/* Category Badge */}
                      {product.category && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-amber-900/30 text-amber-300 text-xs rounded-full">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {/* Stock Status */}
                      <div>
                        <span
                          className={`text-sm font-semibold ${
                            product.available && product.stock > 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {product.available && product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT SIDE: Rating & Price */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Rating */}
                      {product.rating && (
                        <div className="bg-amber-900/20 px-3 py-2 rounded-lg">
                          <span className="text-amber-300 font-semibold">
                            ⭐ {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Price - Highlighted */}
                      <div className="bg-gradient-to-r from-amber-700/30 to-amber-900/30 px-4 py-2 rounded-lg border border-amber-600/50">
                        <span className="text-2xl font-bold text-amber-400">
                          {formatUSDToBDT(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector & Add to Cart - Pushed to bottom */}
                  <div className="mt-auto">
                    {product.available && product.stock > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center border border-amber-900/50 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(product._id, (quantities[product._id] || 1) - 1)
                            }
                            className="px-3 py-2 bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={quantities[product._id] || 1}
                            onChange={(e) =>
                              updateQuantity(product._id, parseInt(e.target.value) || 1)
                            }
                            className="flex-1 text-center bg-[#252525] text-amber-100 font-bold border-none"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(product._id, (quantities[product._id] || 1) + 1)
                            }
                            className="px-3 py-2 bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-black text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-900/50"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-600 text-gray-300 font-bold rounded-lg cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
