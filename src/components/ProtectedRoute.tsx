
import { Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    console.log('Protected route check:', { 
      isAuthenticated, 
      currentUser: !!currentUser,
      isLoading,
      userRole: currentUser?.role,
      path: location.pathname
    });
    
    // Заканчиваем проверку только после загрузки состояния аутентификации
    if (!isLoading) {
      setChecking(false);
    }
  }, [isAuthenticated, currentUser, isLoading, location]);

  // Отображаем ничего во время проверки аутентификации, чтобы избежать мигания
  if (checking || isLoading) {
    return null;
  }

  // Проверка аутентификации
  if (!isAuthenticated || !currentUser) {
    console.log('Не аутентифицирован, перенаправление на логин');
    return <Navigate to="/login" replace />;
  }

  // Для маршрутов администратора проверяем роль
  if (requireAdmin && currentUser.role !== 'admin') {
    console.log('Не администратор, перенаправление на главную', currentUser.role);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
