
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  year: number;
  month: number; // 1-12 для ежемесячно, 1-4 для ежеквартально, 1 для годового
  type: 'income' | 'expense';
  createdBy: string | null;
  createdAt: Date;
  company: string | null;
}

export interface ServerBudget {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  year: number;
  month: number;
  type: 'income' | 'expense';
  createdBy: string | null;
  createdAt: string;
  company: string | null;
}

export type BudgetPeriod = 'monthly' | 'quarterly' | 'annual';

export interface BudgetVariance {
  category: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
}

export interface BudgetSummary {
  period: BudgetPeriod;
  year: number;
  month: number;
  totalBudget: number;
  totalActual: number;
  variance: number;
  variancePercentage: number;
  categories: BudgetVariance[];
}
