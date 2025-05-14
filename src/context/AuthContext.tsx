
import React, { createContext, useContext } from 'react';
import { User } from '@/types/user';
import { useAuthState } from '@/hooks/useAuthState';
import { initialUsers } from '@/utils/initialUsers';
import * as authService from '@/services/authService';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  adminPassword: string;
  login: (userId: string) => void;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  removeUser: (userId: string) => void;
  updateAdminPassword: (newPassword: string) => void;
  verifyAdminPassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    users,
    setUsers,
    adminPassword,
    setAdminPassword
  } = useAuthState();

  // Initialize users if empty
  React.useEffect(() => {
    if (users.length === 0) {
      setUsers(initialUsers);
    }
  }, [users.length, setUsers]);

  // Authentication methods
  const login = (userId: string) => {
    const user = authService.login(userId, users);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const loginWithCredentials = async (username: string, password: string): Promise<boolean> => {
    const user = await authService.loginWithCredentials(username, password, users);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    return authService.addUser(userData, setUsers);
  };

  const removeUser = (userId: string) => {
    const shouldLogout = authService.removeUser(userId, currentUser?.id, setUsers);
    if (shouldLogout) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateAdminPassword = (newPassword: string) => {
    authService.updateAdminPassword(newPassword, setAdminPassword);
  };

  const verifyAdminPassword = (password: string) => {
    return authService.verifyAdminPassword(password, adminPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        isLoading,
        adminPassword,
        login,
        loginWithCredentials,
        logout,
        addUser,
        removeUser,
        updateAdminPassword,
        verifyAdminPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
