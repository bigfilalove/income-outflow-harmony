
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from '@/hooks/use-toast';

/**
 * Check authentication status using Supabase
 */
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('No active session', error?.message);
      return null;
    }
    
    // Map Supabase user to our app's User type
    const user: User = {
      id: session.user.id,
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
      username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
      password: '', // Don't store passwords
      role: session.user.user_metadata?.role || 'user',
      createdAt: new Date(session.user.created_at)
    };
    
    return user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
};

/**
 * Login with email and password using Supabase
 */
export const loginWithSupabase = async (
  username: string, 
  password: string
): Promise<{ user: User, token: string } | null> => {
  try {
    // Check if username is an email
    const isEmail = username.includes('@');
    const email = isEmail ? username : `${username}@example.com`;
    
    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return null;
    }
    
    if (!data.session || !data.user) {
      console.error('Login succeeded but no session or user returned');
      return null;
    }
    
    // Map Supabase user to our app's User type
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
      password: '', // Don't store passwords
      role: data.user.user_metadata?.role || 'user',
      createdAt: new Date(data.user.created_at)
    };
    
    // Store token in localStorage for backward compatibility
    localStorage.setItem('finance-tracker-token', data.session.access_token);
    localStorage.setItem('finance-tracker-user', JSON.stringify(user));
    
    return {
      user,
      token: data.session.access_token
    };
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

/**
 * Log out the current user
 */
export const logoutSupabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      return false;
    }
    
    // Clean up localStorage items
    localStorage.removeItem('finance-tracker-token');
    localStorage.removeItem('finance-tracker-user');
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};
