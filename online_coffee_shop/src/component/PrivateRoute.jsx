import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth';

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication
 * Only logged-in users can access
 * Non-authenticated users are redirected to /login
 * 
 * Usage:
 * <Route 
 *   path="/dashboard" 
 *   element={<PrivateRoute><Dashboard /></PrivateRoute>} 
 * />
 */
export default function PrivateRoute({ children }) {
  // Get auth state from context
  const { isAuthenticated, isLoading } = useAuth();

  // Step 1: Show loading while checking authentication
  // This prevents flashing login page while checking localStorage
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Step 2: If not authenticated, redirect to login
  // replace: true means don't add to history (can't go back to protected page)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: If authenticated, show the protected component
  return children;
}
