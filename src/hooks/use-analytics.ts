
import { useTransactions } from '@/context/TransactionContext';
import { useMemo } from 'react';

interface CategoryTotal {
  category: string;
  total: number;
}

interface CompanyTotal {
  company: string;
  income: number;
  expense: number;
  total: number;
}

interface ProjectTotal {
  project: string;
  income: number;
  expense: number;
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

    // Get company data
    const companyTotals: CompanyTotal[] = (() => {
      const companies: Record<string, { income: number; expense: number; total: number }> = {};
      
      transactions.forEach(t => {
        const companyName = t.company || 'Не указана';
        
        if (!companies[companyName]) {
          companies[companyName] = { income: 0, expense: 0, total: 0 };
        }
        
        if (t.type === 'income') {
          companies[companyName].income += t.amount;
          companies[companyName].total += t.amount;
        } else if (t.type === 'expense') {
          companies[companyName].expense += t.amount;
          companies[companyName].total -= t.amount;
        }
      });
      
      return Object.entries(companies)
        .map(([company, data]) => ({
          company,
          income: data.income,
          expense: data.expense,
          total: data.total
        }))
        .sort((a, b) => b.total - a.total);
    })();

    // Get project data
    const projectTotals: ProjectTotal[] = (() => {
      const projects: Record<string, { income: number; expense: number; total: number }> = {};
      
      transactions.forEach(t => {
        const projectName = t.project || 'Не указан';
        
        if (!projects[projectName]) {
          projects[projectName] = { income: 0, expense: 0, total: 0 };
        }
        
        if (t.type === 'income') {
          projects[projectName].income += t.amount;
          projects[projectName].total += t.amount;
        } else if (t.type === 'expense') {
          projects[projectName].expense += t.amount;
          projects[projectName].total -= t.amount;
        }
      });
      
      return Object.entries(projects)
        .map(([project, data]) => ({
          project,
          income: data.income,
          expense: data.expense,
          total: data.total
        }))
        .sort((a, b) => b.total - a.total);
    })();

    const topIncomeCategories = getCategoryTotal('income');
    const topExpenseCategories = getCategoryTotal('expense');

    return {
      totalIncome,
      totalExpense,
      balance,
      efficiency,
      topIncomeCategories,
      topExpenseCategories,
      companyTotals,
      projectTotals
    };
  }, [transactions]);
}
