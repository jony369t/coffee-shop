import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom Hook: useAuth
 * 
 * Provides easy access to auth context from any component
 * 
 * Usage:
 * const { user, token, login, logout } = useAuth();
 * 
 * @returns {object} Auth context object with user, token, login, logout, etc.
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Validate that hook is used within AuthProvider
  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider. Wrap your app with <AuthProvider> in main.jsx'
    );
  }

  return context;
};
