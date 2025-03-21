
import { User } from '@/types/user';
import { API_URL } from './config';

// Authentication methods
export const loginUser = async (username: string, password: string): Promise<{ user: User, token: string } | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('finance-tracker-token', data.token);
    
    return {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        username: data.username,
        password: '',  // Do not store password in client
        role: data.role,
        createdAt: new Date(data.createdAt || Date.now())
      },
      token: data.token
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const registerUser = async (userData: { 
  name: string, 
  email: string, 
  username: string, 
  password: string, 
  role?: 'admin' | 'user' | 'basic' 
}): Promise<{ user: User, token: string } | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('finance-tracker-token', data.token);
    
    return {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        username: data.username,
        password: '',  // Do not store password in client
        role: data.role,
        createdAt: new Date(data.createdAt || Date.now())
      },
      token: data.token
    };
  } catch (error) {
    console.error('Error registering:', error);
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('finance-tracker-token');
};
