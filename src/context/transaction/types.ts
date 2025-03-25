import { Transaction } from '@/types/transaction';

export interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  updateReimbursementStatus: (id: string, status: 'completed') => Promise<void>;
  getCategoriesStats: () => Promise<Record<string, { category: string; count: number }[]>>;
}