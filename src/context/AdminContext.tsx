
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { toast } from 'sonner';

interface AdminContextType {
  demoUsersList: User[];
  adminPassword: string;
  addDemoUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  removeDemoUser: (userId: string) => void;
  updateAdminPassword: (newPassword: string) => void;
  verifyAdminPassword: (password: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoUsersList, setDemoUsersList] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('finance-tracker-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  const [adminPassword, setAdminPassword] = useState(() => {
    const savedPassword = localStorage.getItem('finance-tracker-admin-password');
    return savedPassword || '123456';
  });

  // Persist users to localStorage when they change
  useEffect(() => {
    localStorage.setItem('finance-tracker-users', JSON.stringify(demoUsersList));
  }, [demoUsersList]);

  // Persist admin password to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('finance-tracker-admin-password', adminPassword);
  }, [adminPassword]);

  // Add a demo user
  const addDemoUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Check if username already exists
      const existingUser = demoUsersList.find(user => user.username === userData.username);
      if (existingUser) {
        toast.error('Пользователь с таким именем уже существует');
        return false;
      }

      // Create new user with generated ID
      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };

      setDemoUsersList(prev => [...prev, newUser]);
      toast.success('Пользователь успешно добавлен');
      return true;
    } catch (error) {
      console.error('Error adding demo user:', error);
      toast.error('Ошибка при добавлении пользователя');
      return false;
    }
  };

  // Remove a demo user
  const removeDemoUser = (userId: string) => {
    setDemoUsersList(prev => prev.filter(user => user.id !== userId));
    toast.success('Пользователь удален');
  };

  // Update admin password
  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  // Verify admin password
  const verifyAdminPassword = (password: string): boolean => {
    return password === adminPassword;
  };

  return (
    <AdminContext.Provider
      value={{
        demoUsersList,
        adminPassword,
        addDemoUser,
        removeDemoUser,
        updateAdminPassword,
        verifyAdminPassword
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin должен использоваться внутри AdminProvider');
  }
  return context;
};
