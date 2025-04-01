// context/TransactionProvider.tsx
import React, { createContext } from 'react';
import { Transaction } from '@/types/transaction';
import { toast } from "sonner";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { TransactionContextType } from './types';
import { useTransactionsQuery } from './useTransactions';
import { useTransactionOperations } from './useTransactionOperations';

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle authentication errors
  const handleAuthError = (error: any) => {
    if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
      toast("Ошибка аутентификации", {
        description: "Ваша сессия истекла. Пожалуйста, войдите снова."
      });
      logout();
      navigate('/login');
    }
  };
  
  // Fetch transactions query
  const { 
    data: transactions = [], 
    isLoading, 
    error 
  } = useTransactionsQuery(handleAuthError);

  // Transaction operations
  const { 
    addTransaction, 
    updateTransaction, 
    deleteTransaction: deleteTransactionOp,
    updateReimbursementStatus: updateStatusOp
  } = useTransactionOperations(handleAuthError);

  // Wrapper functions that include transactions
  const deleteTransaction = async (id: string): Promise<void> => {
    return deleteTransactionOp(id, transactions);
  };

  const updateReimbursementStatus = async (id: string, status: 'completed'): Promise<void> => {
    return updateStatusOp(id, status, transactions);
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  // Fetch categories statistics
  const getCategoriesStats = async (): Promise<Record<string, { category: string; count: number }[]>> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }

    try {
      const response = await fetch('http://localhost:5050/api/transactions/categories-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        if (response.status === 401) {
          throw new Error('Unauthorized: 401');
        }
        throw new Error(errorMessage);
      }
      const stats = await response.json();
      return stats;
    } catch (error) {
      if (error.message.includes('401')) {
        handleAuthError(error);
        throw error; // Перебрасываем ошибку, чтобы компонент мог обработать её
      }
      console.error('Ошибка при загрузке статистики категорий:', error);
      return { income: [], expense: [], reimbursement: [] };
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      isLoading,
      error: error instanceof Error ? error : error ? new Error(String(error)) : null,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionById,
      updateReimbursementStatus,
      getCategoriesStats
    }}>
      {children}
    </TransactionContext.Provider>
  );
};