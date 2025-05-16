
import { Transaction } from '@/types/transaction';

// Utility function to convert from app model to Supabase model
export const toSupabaseTransaction = (transaction: Omit<Transaction, 'id'>) => {
  return {
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category,
    date: transaction.date.toISOString(), // Use ISO string for date
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
    is_investment: transaction.isInvestment || false, // Добавляем поле is_investment
    investor: transaction.investor || null,          // Добавляем поле investor
  };
};

// Utility function to convert from Supabase model to app model
export const fromSupabaseTransaction = (data: any): Transaction => {
  return {
    id: data.id,
    amount: data.amount,
    description: data.description,
    category: data.category,
    date: new Date(data.date),
    type: data.type as 'income' | 'expense' | 'transfer',
    isReimbursement: data.is_reimbursement || false,
    reimbursedTo: data.reimbursed_to || undefined,
    reimbursementStatus: data.reimbursement_status as 'pending' | 'completed' | undefined,
    createdBy: data.created_by || undefined,
    createdAt: data.created_at ? new Date(data.created_at) : undefined,
    company: data.company || undefined,
    project: data.project || undefined,
    isTransfer: data.is_transfer || false,
    fromCompany: data.from_company || undefined,
    toCompany: data.to_company || undefined,
    // Получаем поля investment из базы данных
    isInvestment: data.is_investment || false,
    investor: data.investor || undefined,
    hasAllocations: data.has_allocations || false,
  };
};
