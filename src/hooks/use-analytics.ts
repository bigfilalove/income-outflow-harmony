
import { useTransactions } from '@/context/TransactionContext';
import { useMemo } from 'react';

interface CategoryTotal {
  category: string;
  total: number;
}

export function useAnalytics() {
  const { transactions } = useTransactions();

  return useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;
    const efficiency = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Get categories with highest income and expense
    const getCategoryTotal = (type: 'income' | 'expense'): CategoryTotal[] => {
      const categories: Record<string, number> = {};
      
      transactions
        .filter(t => t.type === type)
        .forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        
      return Object.entries(categories)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total);
    };

    const topIncomeCategories = getCategoryTotal('income');
    const topExpenseCategories = getCategoryTotal('expense');

    return {
      totalIncome,
      totalExpense,
      balance,
      efficiency,
      topIncomeCategories,
      topExpenseCategories
    };
  }, [transactions]);
}
