
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { checkAuth } from '@/services/api';

/**
 * Custom hook to manage authentication state
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      try {
        console.log('Checking for stored authentication...');
        
        // Get user from localStorage
        const storedUserStr = localStorage.getItem('finance-tracker-user');
        const storedToken = localStorage.getItem('finance-tracker-token');
        
        if (storedUserStr && storedToken) {
          console.log('Found user in localStorage');
          const storedUser = JSON.parse(storedUserStr);
          setCurrentUser(storedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // If not in localStorage, check with API
        const apiUser = await checkAuth();
        
        if (apiUser) {
          console.log('Found stored authentication from API:', apiUser.username);
          setCurrentUser(apiUser);
          setIsAuthenticated(true);
        } else {
          console.log('No stored authentication found');
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStoredUser();
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    users,
    setUsers,
    adminPassword,
    setAdminPassword
  };
};
