
// context/TransactionProvider.tsx
import React, { createContext } from 'react';
import { Transaction } from '@/types/transaction';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { TransactionContextType } from './types';
import { useTransactionsQuery } from './useTransactions';
import { useTransactionOperations } from './useTransactionOperations';
import { checkSupabaseConnection } from '@/lib/supabase';

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle authentication errors
  const handleAuthError = (error: any) => {
    if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
      toast({
        title: "Ошибка аутентификации",
        description: "Ваша сессия истекла. Пожалуйста, войдите снова."
      });
      logout();
      navigate('/login');
    }
  };
  
  // Verify Supabase connection on mount
  React.useEffect(() => {
    const verifyConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Ошибка подключения",
          description: "Не удалось подключиться к базе данных. Пожалуйста, проверьте интернет-соединение.",
          variant: "destructive"
        });
      }
    };
    
    verifyConnection();
  }, []);
  
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

  // Fetch categories statistics - we'll use Supabase for this now
  const getCategoriesStats = async (): Promise<Record<string, { category: string; count: number }[]>> => {
    try {
      // Check Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('Не удалось подключиться к базе данных для получения статистики категорий.');
      }
      
      // Query categories from Supabase instead of the old API
      const { data, error } = await supabase
        .from('categories')
        .select('name, type, id');
        
      if (error) {
        throw error;
      }
      
      // Process the data to match the expected return format
      const stats: Record<string, { category: string; count: number }[]> = {
        income: [],
        expense: [],
        reimbursement: [],
        transfer: []
      };
      
      // Count occurrences of each category
      if (data) {
        for (const category of data) {
          const type = category.type as keyof typeof stats;
          if (stats[type]) {
            const existingCategory = stats[type].find(c => c.category === category.name);
            if (existingCategory) {
              existingCategory.count += 1;
            } else {
              stats[type].push({ category: category.name, count: 1 });
            }
          }
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Ошибка при загрузке статистики категорий:', error);
      toast({
        title: "Ошибка",
        description: 'Не удалось загрузить статистику категорий.',
        variant: "destructive"
      });
      return { income: [], expense: [], reimbursement: [], transfer: [] };
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
