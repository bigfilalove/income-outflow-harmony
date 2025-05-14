
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

// Login user with username and password
export const loginSupabase = async (
  username: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  try {
    console.log('Attempting Supabase login with:', { username });
    
    // Get the user from the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      console.error('User not found in Supabase:', error);
      return null;
    }
    
    // For demonstration purposes, accept 'password123' as valid
    if (password === 'password123') {
      console.log('Login successful with password123 for user:', username);
      
      // Create a dummy token
      const mockToken = `dummy-token-${Date.now()}`;
      
      // Save token to localStorage
      localStorage.setItem('finance-tracker-token', mockToken);
      
      return {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          password: '', // Don't return password
          role: data.role,
          createdAt: new Date(data.created_at),
        },
        token: mockToken,
      };
    }
    
    console.error('Invalid password for user:', username);
    return null;
  } catch (error) {
    console.error('Error logging in with Supabase:', error);
    return null;
  }
};

// Logout user
export const logoutSupabase = (): void => {
  localStorage.removeItem('finance-tracker-token');
};

// Register new user
export const registerSupabase = async (
  name: string,
  email: string,
  username: string,
  password: string,
  role: 'admin' | 'user' | 'basic' = 'basic'
): Promise<{ user: User; token: string } | null> => {
  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      throw new Error('User with this email or username already exists');
    }
    
    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        username,
        password, // In a real app, hash the password
        role,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Create dummy token
    const mockToken = `dummy-token-${Date.now()}`;
    
    // Save token to localStorage
    localStorage.setItem('finance-tracker-token', mockToken);
    
    return {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        username: data.username,
        password: '', // Don't return password
        role: data.role,
        createdAt: new Date(data.created_at),
      },
      token: mockToken,
    };
  } catch (error) {
    console.error('Error registering user in Supabase:', error);
    return null;
  }
};
