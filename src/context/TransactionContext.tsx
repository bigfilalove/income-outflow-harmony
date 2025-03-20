
import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '@/types/transaction';
import { sampleTransactions } from '@/data/sampleData';
import { toast } from "@/hooks/use-toast";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  updateReimbursementStatus: (id: string, status: 'completed') => void;
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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 11)
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    let toastTitle = transaction.type === 'income' ? 'Доход добавлен' : 'Расход добавлен';
    if (transaction.isReimbursement) {
      toastTitle = 'Возмещение добавлено';
    }
    
    toast({
      title: toastTitle,
      description: `${transaction.description} было успешно добавлено.`
    });
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    setTransactions(transactions.filter(t => t.id !== id));
    
    let toastTitle = transaction.type === 'income' ? 'Доход удален' : 'Расход удален';
    if (transaction.isReimbursement) {
      toastTitle = 'Возмещение удалено';
    }
    
    toast({
      title: toastTitle,
      description: `${transaction.description} было успешно удалено.`
    });
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const updateReimbursementStatus = (id: string, status: 'completed') => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction || !transaction.isReimbursement) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, reimbursementStatus: status } : t
    );
    
    setTransactions(updatedTransactions);
    
    toast({
      title: 'Статус обновлен',
      description: `Возмещение для "${transaction.description}" отмечено как выполненное.`
    });
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      getTransactionById,
      updateReimbursementStatus
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
