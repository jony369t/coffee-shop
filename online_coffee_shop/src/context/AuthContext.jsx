import React, { createContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state globally
 * 
 * Provides:
 * - user: Current logged-in user object
 * - token: JWT token for API requests
 * - login: Function to authenticate user
 * - logout: Function to sign out user
 * - isLoading: Loading state for async operations
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

/**
 * AuthProvider - Wrapper component that provides auth context to all children
 * 
 * Usage:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  // State management
  // user: Stores logged-in user info (name, email, role, id)
  // token: Stores JWT token for API authentication
  // isLoading: Shows if auth check is in progress
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On component mount, check if token exists in localStorage
  // This allows user to stay logged in after page refresh
  useEffect(() => {
    const loadAuthData = () => {
      try {
        // Retrieve token from localStorage
        // localStorage persists data even after browser closes
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');

        if (savedToken && savedUser) {
          // Parse stored user JSON and set state
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } finally {
        // Mark loading as complete
        setIsLoading(false);
      }
    };

    // Call on mount
    loadAuthData();
  }, []); // Empty dependency array = run once on mount

  /**
   * LOGIN FUNCTION
   * Authenticates user with email and password
   * 
   * Process:
   * 1. Send credentials to backend
   * 2. Backend returns token and user info
   * 3. Store in state
   * 4. Save to localStorage for persistence
   * 5. Return result for UI feedback
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} { success: boolean, message: string }
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // API call to backend login endpoint
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if request was successful
      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Login failed',
        };
      }

      // Parse response data
      const data = await response.json();

      // Destructure token and user from response
      const { token: newToken, user: userData } = data;

      // Update state with new auth data
      setToken(newToken);
      setUser(userData);

      // Persist to localStorage so user stays logged in
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * REGISTER FUNCTION
   * Creates new user account
   * 
   * Process:
   * 1. Send registration data to backend
   * 2. Backend creates user and returns token
   * 3. Auto-login user
   * 4. Store token and user in state and localStorage
   * 
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} { success: boolean, message: string }
   */
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);

      // API call to backend register endpoint
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Registration failed',
        };
      }

      // Parse response
      const data = await response.json();
      const { token: newToken, user: userData } = data;

      // Auto-login: Set user as logged in
      setToken(newToken);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LOGOUT FUNCTION
   * Signs out user and clears all auth data
   * 
   * Process:
   * 1. Clear state (user, token)
   * 2. Clear localStorage
   * 3. User is now logged out
   */
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  /**
   * Context value object
   * Provides all auth functionality to consuming components
   */
  const value = {
    user,           // Current user object or null
    token,          // JWT token for API calls or null
    isLoading,      // Loading state for initial auth check
    login,          // Function to login
    register,       // Function to register
    logout,         // Function to logout
    isAuthenticated: !!token, // Boolean: is user logged in?
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
