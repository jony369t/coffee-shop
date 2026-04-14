import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth';

/**
 * AdminRoute Component
 * 
 * Protects admin-only routes
 * Only users with role "admin" can access
 * 
 * Redirect rules:
 * - NOT logged in → redirect to /login
 * - Logged in but NOT admin → redirect to /
 * - Logged in AND admin → show component
 * 
 * Usage:
 * <Route 
 *   path="/admin/dashboard" 
 *   element={<AdminRoute><AdminDashboard /></AdminRoute>} 
 * />
 */
export default function AdminRoute({ children }) {
  // Get auth state from context
  const { user, isAuthenticated, isLoading } = useAuth();

  // Step 1: Show loading while checking authentication
  // Prevents flashing redirect while checking localStorage
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

  // Step 2: If NOT logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: If logged in but NOT admin, redirect to home
  // user.role comes from JWT token (set by backend)
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Step 4: If logged in AND admin, show the component
  return children;
}
