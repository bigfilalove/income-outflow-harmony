
import { supabase } from '@/lib/supabase';
import { Transaction, NewTransaction } from '@/types/transaction';

// Получить список транзакций
export const fetchTransactionsSupabase = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date),
      type: transaction.type,
      isReimbursement: transaction.is_reimbursement,
      reimbursedTo: transaction.reimbursed_to,
      reimbursementStatus: transaction.reimbursement_status,
      createdBy: transaction.created_by,
      createdAt: new Date(transaction.created_at),
      company: transaction.company,
      project: transaction.project,
      isTransfer: transaction.is_transfer,
      fromCompany: transaction.from_company,
      toCompany: transaction.to_company,
      hasAllocations: transaction.has_allocations,
    }));
  } catch (error) {
    console.error('Error fetching transactions from Supabase:', error);
    return [];
  }
};

// Создать новую транзакцию
export const createTransactionSupabase = async (transaction: NewTransaction): Promise<Transaction | null> => {
  try {
    const supabaseTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
      type: transaction.type,
      is_reimbursement: transaction.isReimbursement,
      reimbursed_to: transaction.reimbursedTo,
      reimbursement_status: transaction.reimbursementStatus,
      created_by: transaction.createdBy,
      company: transaction.company,
      project: transaction.project,
      is_transfer: transaction.isTransfer,
      from_company: transaction.fromCompany,
      to_company: transaction.toCompany,
      has_allocations: transaction.hasAllocations,
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(supabaseTransaction)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      type: data.type,
      isReimbursement: data.is_reimbursement,
      reimbursedTo: data.reimbursed_to,
      reimbursementStatus: data.reimbursement_status,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      company: data.company,
      project: data.project,
      isTransfer: data.is_transfer,
      fromCompany: data.from_company,
      toCompany: data.to_company,
      hasAllocations: data.has_allocations,
    };
  } catch (error) {
    console.error('Error creating transaction in Supabase:', error);
    return null;
  }
};

// Обновить транзакцию
export const updateTransactionSupabase = async (transaction: Transaction): Promise<Transaction | null> => {
  try {
    const supabaseTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
      type: transaction.type,
      is_reimbursement: transaction.isReimbursement,
      reimbursed_to: transaction.reimbursedTo,
      reimbursement_status: transaction.reimbursementStatus,
      created_by: transaction.createdBy,
      company: transaction.company,
      project: transaction.project,
      is_transfer: transaction.isTransfer,
      from_company: transaction.fromCompany,
      to_company: transaction.toCompany,
      has_allocations: transaction.hasAllocations,
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .update(supabaseTransaction)
      .eq('id', transaction.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      type: data.type,
      isReimbursement: data.is_reimbursement,
      reimbursedTo: data.reimbursed_to,
      reimbursementStatus: data.reimbursement_status,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      company: data.company,
      project: data.project,
      isTransfer: data.is_transfer,
      fromCompany: data.from_company,
      toCompany: data.to_company,
      hasAllocations: data.has_allocations,
    };
  } catch (error) {
    console.error('Error updating transaction in Supabase:', error);
    return null;
  }
};

// Удалить транзакцию
export const deleteTransactionSupabase = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction from Supabase:', error);
    return false;
  }
};

// Обновить статус возмещения
export const updateTransactionStatusSupabase = async (id: string, status: 'completed'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ reimbursement_status: status })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating transaction status in Supabase:', error);
    return false;
  }
};
