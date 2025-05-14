
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false
}) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('Protected route check:', { 
      isAuthenticated, 
      currentUser: !!currentUser,
      isLoading
    });
    
    // Only finish checking once the auth state has loaded
    if (!isLoading) {
      setChecking(false);
    }
  }, [isAuthenticated, currentUser, isLoading]);

  // Show nothing while checking authentication to prevent flashes
  if (checking || isLoading) {
    return null;
  }

  // Simple authentication check - only relying on the auth context
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // For admin routes, check the role
  if (requireAdmin && currentUser?.role !== 'admin') {
    console.log('Not an admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
