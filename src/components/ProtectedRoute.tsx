
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
    // Check if the token exists in localStorage as a backup validation
    const hasToken = !!localStorage.getItem('finance-tracker-token');
    const hasUser = !!localStorage.getItem('finance-tracker-user');
    
    console.log('Protected route check:', { 
      isAuthenticated, 
      currentUser: !!currentUser,
      hasToken,
      hasUser,
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

  // Check both the auth context and localStorage as a fallback
  const token = localStorage.getItem('finance-tracker-token');
  const userInStorage = localStorage.getItem('finance-tracker-user');
  
  if (!isAuthenticated && (!token || !userInStorage)) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // For admin routes, check the role
  if (requireAdmin) {
    const userRole = currentUser?.role || 
      (userInStorage ? JSON.parse(userInStorage).role : null);
      
    if (userRole !== 'admin') {
      console.log('Not an admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
