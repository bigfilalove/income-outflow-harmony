
import { Transaction } from './transaction';

export interface InvestmentExpense {
  id: string;
  investment_id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  project?: string;
  created_by?: string;
  created_at?: Date;
}

export interface InvestmentWithExpenses extends Transaction {
  expenses?: InvestmentExpense[];
}
