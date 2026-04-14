/* global process */
import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * Creates a signed token containing user information
 * 
 * @param {string} userId - User's ID from MongoDB
 * @param {string} email - User's email
 * @param {string} role - User's role (user or admin)
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId, email, role) => {
  // Sign creates a token with payload and secret key
  // expiresIn: "7d" means token expires after 7 days
  const token = jwt.sign(
    {
      userId,      // User's MongoDB ID
      email,       // User's email
      role,        // User's role (user/admin)
    },
    process.env.JWT_SECRET,  // Secret key from .env file
    {
      expiresIn: '7d',  // Token valid for 7 days
    }
  );

  return token;
};

/**
 * Verify JWT Token
 * Decodes and verifies a token is valid
 * 
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};
