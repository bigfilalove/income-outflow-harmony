
// Fix authService.ts
import { User, UserCredentials } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Authenticate a user with username and password
export const loginWithCredentials = async (credentials: UserCredentials): Promise<User | null> => {
  try {
    const { username, password } = credentials;
    
    // Check if the username is an email
    const isEmail = username.includes('@');
    
    // Attempt to sign in with Supabase
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: isEmail ? username : `${username}@example.com`, // If not email, convert to email format
      password
    });
    
    if (error) {
      console.error('Login error:', error.message);
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    // Get user data
    if (authData.user) {
      const user: User = {
        id: authData.user.id,
        name: authData.user.user_metadata.name || authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        username: authData.user.email?.split('@')[0] || '',
        password: '', // Don't store passwords
        role: authData.user.user_metadata.role || 'user',
        createdAt: new Date(authData.user.created_at),
      };
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication service error:', error);
    toast({
      title: 'Service Error',
      description: 'An unexpected error occurred during login',
      variant: 'destructive',
    });
    return null;
  }
};

// Logout the current user
export const logout = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Logout service error:', error);
    toast({
      title: 'Service Error',
      description: 'An unexpected error occurred during logout',
      variant: 'destructive',
    });
    return false;
  }
};

// Check current authentication status
export const checkAuth = async (): Promise<User | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }
    
    // Get user data
    const user: User = {
      id: session.user.id,
      name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
      username: session.user.email?.split('@')[0] || '',
      password: '', // Don't store passwords
      role: session.user.user_metadata.role || 'user',
      createdAt: new Date(session.user.created_at),
    };
    
    return user;
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
};
