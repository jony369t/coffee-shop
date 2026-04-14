/* eslint-env node */
import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * GET /api/admin/dashboard
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Returns dashboard statistics:
 * - Total users count
 * - Total products count
 * - Admin info
 */
export const getAdminDashboard = async (req, res) => {
  try {
    // req.user contains: { userId, email, role }
    // protect middleware verified token
    // adminOnly middleware verified user.role === 'admin'

    // Get total user count
    const totalUsers = await User.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get admin's information
    const admin = await User.findById(req.user.userId).select('-password');

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved',
      dashboard: {
        totalUsers,
        totalProducts,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/users
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Returns all users (excludes passwords)
 * Useful for admin to view all registered users
 */
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from database, exclude password field
    const users = await User.find().select('-password');

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No users found',
        users: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `Retrieved ${users.length} users`,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Delete a user by ID
 * Requires:
 * - Valid admin token
 * - Valid user ID in URL parameter
 */
export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate user ID format
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Find and delete user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${deletedUser.email} deleted successfully`,
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
}

/**
 * POST /api/admin/products
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Add new product to the menu
 * 
 * Body: { name, description, price, category, image, stock, allergens, featured }
 */
export const createProduct = async (req, res) => {
  try {
    // Destructure request body
    const { name, description, price, category, image, stock, allergens, featured } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category',
      });
    }

    // Validate price is positive
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    // Validate category against enum
    const validCategories = ['espresso', 'cold-drinks', 'hot-drinks', 'pastries', 'merchandise'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`,
      });
    }

    // Check if product with same name already exists (optional)
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product "${name}" already exists. Please use a different name.`,
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: image || null,
      stock: stock || 0,
      allergens: allergens || null,
      featured: featured || false,
      available: true, // New products are available by default
      rating: 0,       // Start with no rating
      reviews: 0,      // Start with no reviews
    });

    // Save to database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/products/:id
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Update an existing product
 * 
 * Body: { name, description, price, category, image, stock, allergens, featured, available }
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Validate product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Validate price if provided
    if (updates.price !== undefined && updates.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    // Validate category if provided
    if (updates.category) {
      const validCategories = ['espresso', 'cold-drinks', 'hot-drinks', 'pastries', 'merchandise'];
      if (!validCategories.includes(updates.category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${validCategories.join(', ')}`,
        });
      }
    }

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/products/:id
 * 
 * ADMIN-ONLY ROUTE
 * 
 * Delete a product from the menu
 * 
 * URL Parameter: productId
 */
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Find and delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Product "${deletedProduct.name}" deleted successfully`,
      product: {
        id: deletedProduct._id,
        name: deletedProduct.name,
        price: deletedProduct.price,
        category: deletedProduct.category,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};
