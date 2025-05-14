
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { checkAuth } from '@/services/api';

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('finance-tracker-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    const savedPassword = localStorage.getItem('finance-tracker-admin-password');
    return savedPassword || '123456';
  });

  // Persist users to localStorage when they change
  useEffect(() => {
    localStorage.setItem('finance-tracker-users', JSON.stringify(users));
  }, [users]);

  // Persist admin password to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('finance-tracker-admin-password', adminPassword);
  }, [adminPassword]);

  // Check for stored auth on mount
  useEffect(() => {
    const checkStoredUser = async () => {
      const storedUser = await checkAuth();
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
      }
    };
    
    checkStoredUser();
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    users,
    setUsers,
    adminPassword,
    setAdminPassword
  };
};
