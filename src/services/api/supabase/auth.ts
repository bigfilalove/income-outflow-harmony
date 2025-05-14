
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Sample users for demo authentication
export const demoUsers: User[] = [
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

// Sign in with email and password
export const loginWithCredentialsSupabase = async (username: string, password: string): Promise<User | null> => {
  console.log(`[Supabase Auth] Attempting login with: ${username}`);
  
  try {
    // Check if it's a demo account first
    const demoUser = demoUsers.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (demoUser) {
      console.log('[Supabase Auth] Demo user login successful:', demoUser.username);
      // Store user and session in localStorage for persistence
      localStorage.setItem('finance-tracker-user', JSON.stringify(demoUser));
      localStorage.setItem('finance-tracker-token', 'demo-token-' + Date.now());
      return demoUser;
    }
    
    // If not a demo user, try to authenticate with Supabase
    const { data: { user: supabaseUser, session }, error } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@example.com`, 
      password: password
    });
    
    if (error) {
      console.error('[Supabase Auth] Authentication error:', error.message);
      return null;
    }
    
    if (supabaseUser) {
      console.log('[Supabase Auth] Supabase login successful:', supabaseUser.email);
      
      // Mapping from Supabase user to our User type
      const userRole = (supabaseUser.user_metadata.role as 'admin' | 'user' | 'basic') || 'basic';
      
      const user: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        username: supabaseUser.email?.split('@')[0] || '',
        password: '', // Don't return the actual password
        role: userRole,
        createdAt: new Date(supabaseUser.created_at)
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('finance-tracker-user', JSON.stringify(user));
      
      // Explicitly store token for backup persistence
      if (session?.access_token) {
        localStorage.setItem('finance-tracker-token', session.access_token);
      }
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('[Supabase Auth] Error during login:', error);
    return null;
  }
};

// Sign out
export const logoutSupabase = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('finance-tracker-user');
    localStorage.removeItem('finance-tracker-token');
  } catch (error) {
    console.error('[Supabase Auth] Error during logout:', error);
  }
};

// Check if there is an active session
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    console.log('[Supabase Auth] Checking authentication status...');
    
    // Try to get session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('[Supabase Auth] Active Supabase session found:', session.user.id);
      const { user: supabaseUser } = session;
      
      // Return user data
      const userRole = (supabaseUser.user_metadata.role as 'admin' | 'user' | 'basic') || 'basic';
      
      const user: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        username: supabaseUser.email?.split('@')[0] || '',
        password: '', // We don't store or return the password
        role: userRole,
        createdAt: new Date(supabaseUser.created_at)
      };
      
      // Store the user info for backup persistence
      localStorage.setItem('finance-tracker-user', JSON.stringify(user));
      
      // Explicitly store token for backup persistence
      if (session?.access_token) {
        localStorage.setItem('finance-tracker-token', session.access_token);
      }
      
      return user;
    }
    
    // If no Supabase session, check localStorage for a demo user
    const storedUser = localStorage.getItem('finance-tracker-user');
    const storedToken = localStorage.getItem('finance-tracker-token');
    
    if (storedUser && storedToken) {
      console.log('[Supabase Auth] No Supabase session, but found stored user');
      return JSON.parse(storedUser);
    }
    
    console.log('[Supabase Auth] No authentication found');
    return null;
  } catch (error) {
    console.error('[Supabase Auth] Error checking auth status:', error);
    return null;
  }
};
