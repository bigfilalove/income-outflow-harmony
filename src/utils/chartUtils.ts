import { Transaction } from '@/types/transaction';
import { getMonthName } from '@/lib/date-utils';
import { getTransactionCategories } from '@/types/transaction';

export const getCategoryData = (transactions: Transaction[], type: 'income' | 'expense') => {
  const data: { [key: string]: number } = {};
  
  // Initialize all categories to 0
  (type === 'income' ? getTransactionCategories().income : getTransactionCategories().expense)
    .forEach(category => {
      data[category] = 0;
    });
  
  // Sum transactions by category
  transactions
    .filter(t => t.type === type)
    .forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
  
  // Convert to array format for charts
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
};

export const getMonthlyData = (transactions: Transaction[]) => {
  const months: { [key: string]: { income: number; expense: number } } = {};
  
  // Get last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = getMonthName(month);
    months[monthKey] = { income: 0, expense: 0 };
  }
  
  // Sum transactions by month
  transactions.forEach(t => {
    const monthKey = getMonthName(t.date);
    if (months[monthKey]) {
      months[monthKey][t.type] += t.amount;
    }
  });
  
  // Convert to array format for charts
  return Object.entries(months).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense
  }));
};

// Define colors for charts
export const INCOME_COLORS = ['#34D399', '#10B981', '#059669', '#047857', '#065F46'];
export const EXPENSE_COLORS = ['#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B'];
