
import { ServerTransaction, Transaction } from '@/types/transaction';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

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

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_URL}/transactions`);
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
