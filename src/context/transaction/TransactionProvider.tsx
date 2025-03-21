
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

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      isLoading,
      error: error as Error | null,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionById,
      updateReimbursementStatus
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
