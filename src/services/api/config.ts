
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
