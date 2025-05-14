
import { User } from '@/types/user';
import { loginWithCredentials as apiLoginWithCredentials, logout as apiLogout } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const login = (userId: string, users: User[]) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    localStorage.setItem('finance-tracker-current-user', userId);
    localStorage.setItem('finance-tracker-token', 'dummy-token-' + Date.now());
    localStorage.setItem('finance-tracker-user', JSON.stringify(user));
    console.log('User logged in and stored in localStorage:', user);
    return user;
  }
  console.log('Failed to find user with ID:', userId);
  return null;
};

export const loginWithCredentials = async (
  username: string, 
  password: string, 
  users: User[]
): Promise<User | null> => {
  try {
    console.log(`Attempting to login with username: ${username}`);
    
    // First try direct API authentication (which includes both Supabase and demo accounts)
    const user = await apiLoginWithCredentials(username, password);
    
    if (user) {
      console.log('Authentication successful:', user);
      // Ensure we store the user data in localStorage
      localStorage.setItem('finance-tracker-user', JSON.stringify(user));
      console.log('User data stored in localStorage');
      return user;
    }
    
    // Fallback: Try local authentication with our predefined users
    const localUser = users.find(u => u.username === username && u.password === password);
    
    if (localUser) {
      console.log('Local authentication successful:', localUser);
      localStorage.setItem('finance-tracker-current-user', localUser.id);
      localStorage.setItem('finance-tracker-token', 'dummy-token-' + Date.now());
      localStorage.setItem('finance-tracker-user', JSON.stringify(localUser));
      console.log('Local user data stored in localStorage with role:', localUser.role);
      return localUser;
    }
    
    console.log('Authentication failed for username:', username);
    toast({
      title: "Не удалось войти в систему. Проверьте логин и пароль.",
      variant: "destructive"
    });
    return null;
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Ошибка при входе в систему.",
      variant: "destructive"
    });
    return null;
  }
};

export const logout = () => {
  console.log('Logging out, clearing localStorage items');
  localStorage.removeItem('finance-tracker-current-user');
  localStorage.removeItem('finance-tracker-token');
  localStorage.removeItem('finance-tracker-user');
  apiLogout(); // Clear token from localStorage
};

export const addUser = async (
  userData: Omit<User, 'id' | 'createdAt'>,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
): Promise<boolean> => {
  try {
    console.log("Creating new user with role:", userData.role);
    
    // Create a new user locally
    const newUser: User = {
      ...userData,
      id: String(Date.now()),
      role: userData.role || 'basic', // Ensure role is set
      createdAt: new Date()
    };
    
    console.log("New user created:", newUser);
    setUsers(prev => [...prev, newUser]);
    return true;
  } catch (error) {
    console.error("Failed to create user:", error);
    toast({
      title: "Не удалось создать пользователя",
      variant: "destructive"
    });
    return false;
  }
};

export const removeUser = (
  userId: string, 
  currentUserId: string | undefined, 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  setUsers(prev => prev.filter(user => user.id !== userId));
  if (currentUserId === userId) {
    logout();
    return true;
  }
  return false;
};

export const updateAdminPassword = (
  newPassword: string,
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>
) => {
  setAdminPassword(newPassword);
};

export const verifyAdminPassword = (
  password: string,
  adminPassword: string
): boolean => {
  return password === adminPassword;
};
