
import React, { createContext, useContext } from 'react';
import { User } from '@/types/user';
import { Session } from '@supabase/supabase-js';
import { useAuthProvider } from '@/hooks/useAuthProvider';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoUsersList: User[];
  adminPassword: string;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addDemoUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  removeDemoUser: (userId: string) => void;
  updateAdminPassword: (newPassword: string) => void;
  verifyAdminPassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    session,
    isAuthenticated,
    isLoading,
    demoUsersList,
    adminPassword,
    loginWithCredentials,
    logout,
    addDemoUser,
    removeDemoUser,
    updateAdminPassword,
    verifyAdminPassword
  } = useAuthProvider();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated,
        isLoading,
        demoUsersList,
        adminPassword,
        loginWithCredentials,
        logout,
        addDemoUser,
        removeDemoUser,
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
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
