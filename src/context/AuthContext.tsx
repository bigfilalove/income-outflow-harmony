
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterData } from '@/types/user';
import { loginWithCredentials, logout as apiLogout, checkAuth } from '@/services/api';
import { toast } from 'sonner';

// Sample users data with usernames and passwords
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@example.com',
    username: 'admin',
    password: 'password123',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Пользователь',
    email: 'user@example.com',
    username: 'user',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: 'Базовый пользователь',
    email: 'basic@example.com',
    username: 'basic',
    password: 'password123',
    role: 'basic',
    createdAt: new Date('2023-01-03')
  },
  {
    id: '4',
    name: 'Бухгалтер',
    email: 'accountant@example.com',
    username: 'accountant',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-04')
  },
  {
    id: '5',
    name: 'Менеджер',
    email: 'manager@example.com',
    username: 'manager',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-05')
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
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
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

  useEffect(() => {
    localStorage.setItem('finance-tracker-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('finance-tracker-admin-password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    // Check if we have a stored user in localStorage
    const checkStoredUser = async () => {
      const storedUser = await checkAuth();
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
      }
    };
    
    checkStoredUser();
  }, []);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('finance-tracker-current-user', userId);
      localStorage.setItem('finance-tracker-token', 'dummy-token-' + Date.now());
    }
  };

  const loginWithCredentials = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log(`Attempting to login with username: ${username}`);
      
      // First try direct API authentication (which includes both Supabase and demo accounts)
      const user = await loginWithCredentials(username, password);
      
      if (user) {
        console.log('Authentication successful:', user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      }
      
      // Fallback: Try local authentication with our predefined users
      const localUser = users.find(u => u.username === username && u.password === password);
      
      if (localUser) {
        console.log('Local authentication successful:', localUser);
        setCurrentUser(localUser);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-current-user', localUser.id);
        localStorage.setItem('finance-tracker-token', 'dummy-token-' + Date.now());
        return true;
      }
      
      console.log('Authentication failed for username:', username);
      toast.error("Не удалось войти в систему. Проверьте логин и пароль.");
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Ошибка при входе в систему.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('finance-tracker-current-user');
    localStorage.removeItem('finance-tracker-token');
    localStorage.removeItem('finance-tracker-user');
    apiLogout(); // Clear token from localStorage
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Create a new user locally
      const newUser: User = {
        ...userData,
        id: String(Date.now()),
        role: userData.role || 'user',
        createdAt: new Date()
      };
      
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Не удалось создать пользователя");
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
