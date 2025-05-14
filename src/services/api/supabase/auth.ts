
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

// Log in with username and password
export const loginWithCredentialsSupabase = async (username: string, password: string): Promise<User | null> => {
  try {
    console.log(`Attempting Supabase login for user: ${username}`);
    
    // Demo accounts for testing - these will work regardless of Supabase connection
    const demoAccounts = [
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
    
    // First check if the username and password match one of our demo accounts
    const demoUser = demoAccounts.find(
      account => account.username === username && account.password === password
    );
    
    if (demoUser) {
      console.log('Demo account authenticated successfully:', demoUser);
      
      // Store auth token in localStorage
      localStorage.setItem('finance-tracker-token', 'dummy-token-for-demo-account');
      localStorage.setItem('finance-tracker-user', JSON.stringify(demoUser));
      
      return demoUser;
    }
    
    // If no demo account match, try Supabase authentication
    try {
      // First try to get the user from the users table
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        return null;
      }
      
      if (!users) {
        console.error('User not found');
        return null;
      }
      
      // Very simple password check (in production, this would use bcrypt)
      if (users.password !== password) {
        console.error('Invalid password');
        return null;
      }
      
      // Successfully authenticated
      console.log('User authenticated successfully:', users);
      
      // Transform to our app's User type
      const appUser: User = {
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        password: '', // Don't return the actual password
        role: users.role || 'basic',
        createdAt: new Date(users.created_at)
      };
      
      // Store auth token in localStorage
      localStorage.setItem('finance-tracker-token', 'dummy-token-for-supabase');
      localStorage.setItem('finance-tracker-user', JSON.stringify(appUser));
      
      return appUser;
    } catch (error) {
      console.error('Supabase login error:', error);
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Log out
export const logoutSupabase = async (): Promise<void> => {
  try {
    console.log('Logging out');
    
    // Clear local storage
    localStorage.removeItem('finance-tracker-token');
    localStorage.removeItem('finance-tracker-user');
    
    return;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Check if the user is already logged in
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    // Check for the token and user in localStorage
    const token = localStorage.getItem('finance-tracker-token');
    const userJson = localStorage.getItem('finance-tracker-user');
    
    if (!token || !userJson) {
      console.log('No stored credentials found');
      return null;
    }
    
    // Parse the user from localStorage
    try {
      const user = JSON.parse(userJson) as User;
      console.log('User found in localStorage:', user);
      return user;
    } catch {
      console.error('Error parsing user from localStorage');
      return null;
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return null;
  }
};
