import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';

/**
 * Admin Dashboard Page
 * 
 * Features:
 * - View all users
 * - Delete users
 * - View all products
 * - Add new products
 * - Delete products
 * 
 * Only accessible to users with role "admin"
 */
export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'products'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ============ USERS STATE ============
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ============ PRODUCTS STATE ============
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'espresso',
    image: '',
    stock: '',
    available: true,
    allergens: '',
  });

  const API_URL = 'http://localhost:5000/api';

  // ============ API HELPER FUNCTIONS ============

  /**
   * Make authenticated API calls
   * Automatically includes Authorization header with token
   */
  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  // ============ USERS SECTION ============

  /**
   * Fetch all users (admin-only)
   */
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setError('');
    try {
      const data = await apiCall('/admin/users');
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [apiCall]);

  /**
   * Delete a user by ID
   */
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiCall(`/admin/users/${userId}`, {
        method: 'DELETE',
      });

      setSuccess('User deleted successfully');
      setUsers(users.filter((u) => u._id !== userId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // ============ PRODUCTS SECTION ============

  /**
   * Fetch all products (public endpoint)
   */
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setError('');
    try {
      // Public endpoint - no auth needed for viewing
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  /**
   * Add new product
   */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        allergens: newProduct.allergens.split(',').map((a) => a.trim()),
      };

      const data = await apiCall('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      setSuccess('Product added successfully');
      setProducts([...products, data.product]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'espresso',
        image: '',
        stock: '',
        available: true,
        allergens: '',
      });
      setShowAddProductForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to add product:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete product by ID
   */
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await apiCall(`/admin/products/${productId}`, {
        method: 'DELETE',
      });

      setSuccess('Product deleted successfully');
      setProducts(products.filter((p) => p._id !== productId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // ============ LIFECYCLE ============

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, fetchUsers, fetchProducts]);

  // ============ RENDER ============

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}!</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error mb-4 shadow-lg">
            <span>{error}</span>
            <button onClick={() => setError('')} className="btn btn-sm btn-ghost">
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-4 shadow-lg">
            <span>{success}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-bordered mb-6 bg-white rounded-lg p-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`tab tab-lg ${
              activeTab === 'users' ? 'tab-active' : ''
            }`}
          >
            👥 Users Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`tab tab-lg ${
              activeTab === 'products' ? 'tab-active' : ''
            }`}
          >
            📦 Products Management
          </button>
        </div>

        {/* ============ USERS TAB ============ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
              <button
                onClick={fetchUsers}
                className="btn btn-sm btn-outline btn-primary"
              >
                🔄 Refresh
              </button>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="font-semibold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin'
                                ? 'badge-warning'
                                : 'badge-info'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="btn btn-sm btn-error"
                            disabled={u.role === 'admin' && u._id === user?._id}
                            title={
                              u.role === 'admin' && u._id === user?._id
                                ? 'Cannot delete yourself'
                                : ''
                            }
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============ PRODUCTS TAB ============ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {showAddProductForm ? 'Add New Product' : 'Products'}
                </h2>
                <button
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                  className="btn btn-primary"
                >
                  {showAddProductForm ? '✕ Cancel' : '➕ Add Product'}
                </button>
              </div>

              {showAddProductForm && (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <input
                      type="text"
                      placeholder="Product Name *"
                      className="input input-bordered"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />

                    {/* Price */}
                    <input
                      type="number"
                      placeholder="Price *"
                      step="0.01"
                      min="0"
                      className="input input-bordered"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />

                    {/* Category */}
                    <select
                      className="select select-bordered"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="espresso">Espresso</option>
                      <option value="cold-drinks">Cold Drinks</option>
                      <option value="hot-drinks">Hot Drinks</option>
                      <option value="pastries">Pastries</option>
                      <option value="merchandise">Merchandise</option>
                    </select>

                    {/* Stock */}
                    <input
                      type="number"
                      placeholder="Stock *"
                      min="0"
                      className="input input-bordered"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <textarea
                    placeholder="Description"
                    className="textarea textarea-bordered w-full"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                  ></textarea>

                  {/* Image URL */}
                  <input
                    type="text"
                    placeholder="Image URL"
                    className="input input-bordered w-full"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />

                  {/* Allergens */}
                  <input
                    type="text"
                    placeholder="Allergens (comma-separated: nuts, dairy, gluten)"
                    className="input input-bordered w-full"
                    value={newProduct.allergens}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        allergens: e.target.value,
                      })
                    }
                  />

                  {/* Available Checkbox */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={newProduct.available}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          available: e.target.checked,
                        })
                      }
                    />
                    <span>Available for sale</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-success w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Adding...
                      </>
                    ) : (
                      '✅ Add Product'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Product Inventory
                </h3>
                <button
                  onClick={fetchProducts}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  🔄 Refresh
                </button>
              </div>

              {productsLoading ? (
                <div className="text-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No products found
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Available</th>
                        <th>Rating</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td className="font-semibold">{p.name}</td>
                          <td>${p.price.toFixed(2)}</td>
                          <td>
                            <span className="badge badge-lg">
                              {p.category}
                            </span>
                          </td>
                          <td>{p.stock}</td>
                          <td>
                            <span
                              className={`badge ${
                                p.available
                                  ? 'badge-success'
                                  : 'badge-error'
                              }`}
                            >
                              {p.available ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>⭐ {p.rating.toFixed(1)}</td>
                          <td>
                            <button
                              onClick={() => deleteProduct(p._id)}
                              className="btn btn-sm btn-error"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
