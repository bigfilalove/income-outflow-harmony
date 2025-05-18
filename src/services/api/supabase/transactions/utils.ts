
import { Transaction, TransactionType, ReimbursementStatus } from '@/types/transaction';

// Convert Supabase transaction to app transaction model
export const fromSupabaseTransaction = (supabaseTransaction: any): Transaction => {
  return {
    id: supabaseTransaction.id,
    amount: Number(supabaseTransaction.amount),
    description: supabaseTransaction.description,
    category: supabaseTransaction.category,
    date: new Date(supabaseTransaction.date),
    type: supabaseTransaction.type as TransactionType,
    isReimbursement: supabaseTransaction.is_reimbursement || false,
    reimbursedTo: supabaseTransaction.reimbursed_to || undefined,
    reimbursementStatus: supabaseTransaction.reimbursement_status as ReimbursementStatus || undefined,
    createdBy: supabaseTransaction.created_by || undefined,
    createdAt: supabaseTransaction.created_at ? new Date(supabaseTransaction.created_at) : undefined,
    company: supabaseTransaction.company || undefined,
    project: supabaseTransaction.project || undefined,
    isTransfer: supabaseTransaction.is_transfer || false,
    fromCompany: supabaseTransaction.from_company || undefined,
    toCompany: supabaseTransaction.to_company || undefined,
    hasAllocations: supabaseTransaction.has_allocations || false,
    isInvestment: supabaseTransaction.is_investment || false,
    investor: supabaseTransaction.investor || undefined,
    investmentExpenseId: supabaseTransaction.investment_expense_id || undefined,
  };
};

// Convert app transaction to Supabase format
export const toSupabaseTransaction = (transaction: Omit<Transaction, 'id'> | Transaction): any => {
  const supabaseTransaction = {
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category,
    date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
    type: transaction.type,
    is_reimbursement: transaction.isReimbursement || false,
    reimbursed_to: transaction.reimbursedTo || null,
    reimbursement_status: transaction.reimbursementStatus || null,
    created_by: transaction.createdBy || null,
    company: transaction.company || null,
    project: transaction.project || null,
    is_transfer: transaction.isTransfer || false,
    from_company: transaction.fromCompany || null,
    to_company: transaction.toCompany || null,
    has_allocations: transaction.hasAllocations || false,
    is_investment: transaction.isInvestment || false,
    investor: transaction.investor || null,
    investment_expense_id: transaction.investmentExpenseId || null,
  };

  // Add ID only if it exists (for updates)
  if ('id' in transaction && transaction.id) {
    return {
      ...supabaseTransaction,
      id: transaction.id
    };
  }

  return supabaseTransaction;
};
