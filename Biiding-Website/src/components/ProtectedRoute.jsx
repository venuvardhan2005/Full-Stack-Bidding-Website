import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const authenticated = isAuthenticated();
  
  let user = null;
  try {
    user = getUser();
  } catch (error) {
    console.error('Error getting user:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
