
import { ServerTransaction, Transaction } from '@/types/transaction';
import { User, ServerUser } from '@/types/user';

const API_URL = 'http://localhost:3001'; // URL for the JSON Server

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('finance-tracker-token');
};

// Create auth headers
const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...token ? { 'Authorization': `Bearer ${token}` } : {}
  };
};

// Helper to convert server transaction to client transaction
export const mapServerToClient = (serverTx: ServerTransaction): Transaction => {
  return {
    ...serverTx,
    date: new Date(serverTx.date),
    createdAt: serverTx.createdAt ? new Date(serverTx.createdAt) : undefined
  };
};

// Helper to convert client transaction to server transaction
export const mapClientToServer = (clientTx: Omit<Transaction, 'id'>): Omit<ServerTransaction, 'id' | 'createdAt'> => {
  return {
    amount: clientTx.amount,
    description: clientTx.description,
    category: clientTx.category,
    date: clientTx.date.toISOString(),
    type: clientTx.type,
    isReimbursement: clientTx.isReimbursement ?? false,
    reimbursedTo: clientTx.reimbursedTo ?? null,
    reimbursementStatus: clientTx.reimbursementStatus ?? null,
    createdBy: clientTx.createdBy ?? null,
  };
};

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

// Transaction methods with authentication
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data: ServerTransaction[] = await response.json();
    return data.map(mapServerToClient);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> => {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(mapClientToServer(transaction)),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }
    
    const data: ServerTransaction = await response.json();
    return mapServerToClient(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

export const updateTransactionStatus = async (id: string, status: 'completed'): Promise<Transaction | null> => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}/status`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify({ reimbursementStatus: status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update transaction status');
    }
    
    const data: ServerTransaction = await response.json();
    return mapServerToClient(data);
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return null;
  }
};
