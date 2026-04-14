/* eslint-env node */
/* global process */
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user data to request
 * 
 * Token Format: "Bearer <token>"
 * Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export const protect = (req, res, next) => {
  try {
    // Step 1: Extract token from Authorization header
    // Header format: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Step 2: Extract token (remove "Bearer " prefix)
    // authHeader.slice(7) removes first 7 characters ("Bearer ")
    const token = authHeader.slice(7);

    // Step 3: Verify and decode token
    // jwt.verify() checks if token is valid and hasn't expired
    // Throws error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach decoded user data to request object
    // Now req.user contains: { userId, email, role }
    req.user = decoded;

    // Step 5: Continue to next middleware or route handler
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

/**
 * Optional: Admin Authorization Middleware
 * Checks if user has admin role
 * Use after protect middleware: protect, adminOnly
 */
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};
