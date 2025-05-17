
import { Transaction, ServerTransaction } from '@/types/transaction';

// Convert from app Transaction type to Supabase format
export const toSupabaseTransaction = (transaction: Omit<Transaction, 'id'>): any => {
  return {
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category,
    date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
    type: transaction.type,
    is_reimbursement: transaction.isReimbursement || false,
    reimbursed_to: transaction.reimbursedTo || null,
    reimbursement_status: transaction.reimbursementStatus || null,
    created_by: transaction.createdBy || null,
    created_at: transaction.createdAt instanceof Date ? transaction.createdAt.toISOString() : (transaction.createdAt || new Date().toISOString()),
    company: transaction.company || null,
    project: transaction.project || null,
    is_transfer: transaction.isTransfer || false,
    from_company: transaction.fromCompany || null,
    to_company: transaction.toCompany || null,
    has_allocations: transaction.hasAllocations || false,
    project_allocations: transaction.projectAllocations ? JSON.stringify(transaction.projectAllocations) : null,
    is_investment: transaction.isInvestment || false,
    investor: transaction.investor || null,
    investment_expense_id: transaction.investmentExpenseId || null  // Add new field for tracking investment expenses
  };
};

// Convert from Supabase format to app Transaction type
export const fromSupabaseTransaction = (supabaseTransaction: any): Transaction => {
  let projectAllocations;
  if (supabaseTransaction.project_allocations) {
    try {
      if (typeof supabaseTransaction.project_allocations === 'string') {
        projectAllocations = JSON.parse(supabaseTransaction.project_allocations);
      } else {
        projectAllocations = supabaseTransaction.project_allocations;
      }
    } catch (e) {
      console.error('Error parsing project allocations:', e);
      projectAllocations = undefined;
    }
  }

  return {
    id: supabaseTransaction.id,
    amount: parseFloat(supabaseTransaction.amount),
    description: supabaseTransaction.description,
    category: supabaseTransaction.category,
    date: new Date(supabaseTransaction.date),
    type: supabaseTransaction.type as 'income' | 'expense' | 'transfer',
    isReimbursement: supabaseTransaction.is_reimbursement || false,
    reimbursedTo: supabaseTransaction.reimbursed_to || undefined,
    reimbursementStatus: supabaseTransaction.reimbursement_status || undefined,
    createdBy: supabaseTransaction.created_by || undefined,
    createdAt: supabaseTransaction.created_at ? new Date(supabaseTransaction.created_at) : undefined,
    company: supabaseTransaction.company || undefined,
    project: supabaseTransaction.project || undefined,
    isTransfer: supabaseTransaction.is_transfer || false,
    fromCompany: supabaseTransaction.from_company || undefined,
    toCompany: supabaseTransaction.to_company || undefined,
    hasAllocations: supabaseTransaction.has_allocations || false,
    projectAllocations: projectAllocations,
    isInvestment: supabaseTransaction.is_investment || false,
    investor: supabaseTransaction.investor || undefined,
    investmentExpenseId: supabaseTransaction.investment_expense_id || undefined  // Add for tracking investment expenses
  };
};
