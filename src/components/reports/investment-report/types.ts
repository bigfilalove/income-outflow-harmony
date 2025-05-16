
import { Transaction } from '@/types/transaction';

export interface InvestmentReportProps {
  startDate?: Date;
  endDate?: Date;
  company?: string;
  investor?: string;
}

export interface InvestmentSummary {
  investor: string;
  totalInvested: number;
  companies: {
    [company: string]: number;
  };
}

export interface CompanySpendingSummary {
  company: string;
  totalSpent: number;
  categories: {
    [category: string]: number;
  };
}
