
import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '@/types/transaction';
import { sampleTransactions } from '@/data/sampleData';
import { toast } from "@/hooks/use-toast";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
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
    
    toast({
      title: transaction.type === 'income' ? 'Доход добавлен' : 'Расход добавлен',
      description: `${transaction.description} был успешно добавлен.`
    });
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    setTransactions(transactions.filter(t => t.id !== id));
    
    toast({
      title: transaction.type === 'income' ? 'Доход удален' : 'Расход удален',
      description: `${transaction.description} был успешно удален.`
    });
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      getTransactionById
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
