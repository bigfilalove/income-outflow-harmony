
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

// Log in with username and password
export const loginWithCredentialsSupabase = async (username: string, password: string): Promise<User | null> => {
  try {
    console.log(`Attempting Supabase login for user: ${username}`);
    
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
};

// Log out
export const logoutSupabase = async (): Promise<void> => {
  try {
    console.log('Logging out from Supabase');
    
    // Clear local storage
    localStorage.removeItem('finance-tracker-token');
    localStorage.removeItem('finance-tracker-user');
    
    return;
  } catch (error) {
    console.error('Supabase logout error:', error);
    throw error;
  }
};

// Check if the user is already logged in
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    // Check for the token
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
