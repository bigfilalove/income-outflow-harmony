
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { loginUser, registerUser, logoutUser } from '@/services/api';
import { toast } from 'sonner';

// Sample users data with usernames and passwords
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@example.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Пользователь',
    email: 'user@example.com',
    username: 'user',
    password: 'user123',
    role: 'user',
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: 'Базовый пользователь',
    email: 'basic@example.com',
    username: 'basic',
    password: 'basic123',
    role: 'basic',
    createdAt: new Date('2023-01-03')
  }
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  adminPassword: string;
  login: (userId: string) => void;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  removeUser: (userId: string) => void;
  updateAdminPassword: (newPassword: string) => void;
  verifyAdminPassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('finance-tracker-users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => {
    const savedPassword = localStorage.getItem('finance-tracker-admin-password');
    return savedPassword || '123456';
  });

  // Sync users with localStorage
  useEffect(() => {
    localStorage.setItem('finance-tracker-users', JSON.stringify(users));
  }, [users]);

  // Sync admin password with localStorage
  useEffect(() => {
    localStorage.setItem('finance-tracker-admin-password', adminPassword);
  }, [adminPassword]);

  // Check for saved authentication on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('finance-tracker-current-user');
    const token = localStorage.getItem('finance-tracker-token');
    
    if (savedUserId && token) {
      const user = users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, [users]);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('finance-tracker-current-user', userId);
    }
  };

  const loginWithCredentials = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await loginUser(username, password);
      
      if (result) {
        const { user, token } = result;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-current-user', user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Не удалось войти в систему. Проверьте логин и пароль.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('finance-tracker-current-user');
    logoutUser(); // Clear token from localStorage
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const result = await registerUser(userData);
      
      if (result) {
        const { user } = result;
        setUsers(prev => [...prev, user]);
        return true;
      }
      
      return false;
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать пользователя",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    if (currentUser?.id === userId) {
      logout();
    }
  };

  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const verifyAdminPassword = (password: string) => {
    return password === adminPassword;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
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
