
import { useContext } from 'react';
import { TransactionContext } from './TransactionProvider';
import { TransactionContextType } from './types';

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context as TransactionContextType;
};
