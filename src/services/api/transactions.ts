
import { Transaction } from '@/types/transaction';
import { API_URL, createAuthHeaders } from './config';
import { mapServerToClient, mapClientToServer } from './mappers';

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
