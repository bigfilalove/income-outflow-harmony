
// Base API configuration and utilities

// API base URL (uses the Express server instead of json-server)
export const API_URL = 'http://localhost:3001';

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('finance-tracker-token');
};

// Create auth headers
export const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...token ? { 'Authorization': `Bearer ${token}` } : {}
  };
};

// HTTP request helpers
export const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: createAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }
  
  return await response.json();
};

export const post = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }
  
  return await response.json();
};

export const put = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }
  
  return await response.json();
};

export const del = async (endpoint: string): Promise<void> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: createAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }
};
