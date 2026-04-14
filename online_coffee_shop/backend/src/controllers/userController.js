/* eslint-env node */
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../config/jwt.js';

/**
 * GET /api/user/profile
 * 
 * PROTECTED ROUTE - Requires valid JWT token
 * 
 * How it works:
 * 1. Client sends: GET /api/user/profile
 * 2. Authorization header: "Bearer <token>"
 * 3. protect middleware verifies token
 * 4. Decodes token → req.user = { userId, email, role }
 * 5. This controller accesses req.user
 * 6. Returns user info to client
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by protect middleware from JWT token
    // Contains: { userId, email, role }

    // Fetch full user document from database
    const user = await User.findById(req.user.userId).select('-password');
    // .select('-password') excludes password field from response

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user profile information
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

/**
 * POST /api/user/register
 * 
 * PUBLIC ROUTE - Anyone can register
 * 
 * Body: { name, email, password }
 * Returns: { token, user }
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * POST /api/user/login
 * 
 * PUBLIC ROUTE - Any user can login
 * 
 * Body: { email, password }
 * Returns: { token, user }
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * PUT /api/user/profile
 * 
 * PROTECTED ROUTE - Only logged-in users
 * 
 * Update user's profile (name)
 * Body: { name }
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name',
      });
    }

    // Update user by ID from JWT token
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};
