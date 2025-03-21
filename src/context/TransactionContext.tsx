
import React, { createContext, useContext } from 'react';
import { Transaction } from '@/types/transaction';
import { toast } from "sonner";
import { fetchTransactions, createTransaction, deleteTransaction as apiDeleteTransaction, updateTransactionStatus } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  updateReimbursementStatus: (id: string, status: 'completed') => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle authentication errors
  const handleAuthError = (error: any) => {
    if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
      toast({
        title: "Ошибка аутентификации",
        description: "Ваша сессия истекла. Пожалуйста, войдите снова.",
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
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    onError: (error) => {
      handleAuthError(error);
    }
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: apiDeleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  // Update reimbursement status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' }) => 
      updateTransactionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await addTransactionMutation.mutateAsync(transaction);
      
      let toastTitle = transaction.type === 'income' ? 'Доход добавлен' : 'Расход добавлен';
      if (transaction.isReimbursement) {
        toastTitle = 'Возмещение добавлено';
      }
      
      toast({
        title: toastTitle,
        description: `${transaction.description} было успешно добавлено.`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить транзакцию.',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    try {
      await deleteTransactionMutation.mutateAsync(id);
      
      let toastTitle = transaction.type === 'income' ? 'Доход удален' : 'Расход удален';
      if (transaction.isReimbursement) {
        toastTitle = 'Возмещение удалено';
      }
      
      toast({
        title: toastTitle,
        description: `${transaction.description} было успешно удалено.`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить транзакцию.',
      });
    }
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const updateReimbursementStatus = async (id: string, status: 'completed') => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction || !transaction.isReimbursement) return;
    
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      
      toast({
        title: 'Статус обновлен',
        description: `Возмещение для "${transaction.description}" отмечено как выполненное.`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус возмещения.',
      });
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      isLoading,
      error: error as Error | null,
      addTransaction, 
      deleteTransaction,
      getTransactionById,
      updateReimbursementStatus
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
