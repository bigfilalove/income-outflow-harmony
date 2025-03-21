
import { Transaction } from "@/types/transaction";

/**
 * Calculate predicted income for the next month based on historical data
 */
export const predictIncome = (transactions: Transaction[], months: number = 3): number => {
  // Get transactions from last few months
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - months);
  
  const recentIncomes = transactions.filter(t => 
    t.type === 'income' && 
    new Date(t.date) >= startDate
  );
  
  if (recentIncomes.length === 0) return 0;
  
  // Calculate average monthly income
  const totalIncome = recentIncomes.reduce((sum, t) => sum + t.amount, 0);
  const averageMonthlyIncome = totalIncome / months;
  
  return Math.round(averageMonthlyIncome);
};

/**
 * Calculate predicted expenses for the next month based on historical data
 */
export const predictExpenses = (transactions: Transaction[], months: number = 3): number => {
  // Get transactions from last few months
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - months);
  
  const recentExpenses = transactions.filter(t => 
    t.type === 'expense' && 
    new Date(t.date) >= startDate
  );
  
  if (recentExpenses.length === 0) return 0;
  
  // Calculate average monthly expenses
  const totalExpenses = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
  const averageMonthlyExpenses = totalExpenses / months;
  
  return Math.round(averageMonthlyExpenses);
};

/**
 * Predict category-wise expenses for next month
 */
export const predictCategoryExpenses = (transactions: Transaction[], months: number = 3): Array<{category: string, amount: number}> => {
  // Get transactions from last few months
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - months);
  
  const recentExpenses = transactions.filter(t => 
    t.type === 'expense' && 
    new Date(t.date) >= startDate
  );
  
  if (recentExpenses.length === 0) return [];
  
  // Group by category and calculate average
  const categoryTotals: Record<string, number> = {};
  
  recentExpenses.forEach(transaction => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += transaction.amount;
  });
  
  // Convert to array and calculate monthly average
  return Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    amount: Math.round(total / months)
  })).sort((a, b) => b.amount - a.amount);
};

/**
 * Predict balance at the end of next month
 */
export const predictBalance = (
  transactions: Transaction[], 
  currentBalance: number,
  months: number = 3
): number => {
  const predictedIncome = predictIncome(transactions, months);
  const predictedExpenses = predictExpenses(transactions, months);
  
  return currentBalance + predictedIncome - predictedExpenses;
};

