import { API_URL, createAuthHeaders, get, post, put, del } from './config';
import { Transaction, ServerTransaction } from '@/types/transaction';
import { mapServerToClient, mapClientToServer } from './mappers';
import { fetchTransactionsFromSupabase } from './supabase/transactions';

// Export the Supabase implementation of fetchTransactions
export { fetchTransactionsFromSupabase as fetchTransactions };

// Legacy implementation for reference
export const fetchTransactionsLegacy = async (): Promise<Transaction[]> => {
  try {
    const data = await get<ServerTransaction[]>('/transactions');
    return data.map(mapServerToClient);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
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
    
    const data = await response.json();
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
    
    const data = await response.json();
    return mapServerToClient(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};

export const importTransactions = async (transactions: Omit<Transaction, 'id'>[]): Promise<{
  total: number;
  success: number;
  failed: number;
  errors: Array<{ transaction: string; error: string }>;
} | null> => {
  try {
    const response = await fetch(`${API_URL}/transactions/import`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify({
        transactions: transactions.map(mapClientToServer)
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to import transactions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error importing transactions:', error);
    return null;
  }
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction | null> => {
  try {
    const response = await fetch(`${API_URL}/transactions/${transaction.id}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(mapClientToServer(transaction)),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }
    
    const data = await response.json();
    return mapServerToClient(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
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
    
    const data = await response.json();
    return mapServerToClient(data);
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return null;
  }
};
