
import { supabase } from '@/lib/supabase';
import { formatDateShort } from '@/lib/formatters';
import { Transaction } from '@/types/transaction';

// Получение всех транзакций
export const fetchTransactionsFromSupabase = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions from Supabase:', error);
      throw error;
    }

    // Преобразуем данные из Supabase в формат приложения
    return data.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date),
      type: transaction.type as 'income' | 'expense' | 'transfer',
      isReimbursement: transaction.is_reimbursement || false,
      reimbursedTo: transaction.reimbursed_to || undefined,
      reimbursementStatus: transaction.reimbursement_status as 'pending' | 'completed' | undefined,
      createdBy: transaction.created_by || undefined,
      createdAt: transaction.created_at ? new Date(transaction.created_at) : undefined,
      company: transaction.company || undefined,
      project: transaction.project || undefined,
      isTransfer: transaction.is_transfer || false,
      fromCompany: transaction.from_company || undefined,
      toCompany: transaction.to_company || undefined,
      hasAllocations: transaction.has_allocations || false,
    }));
  } catch (error) {
    console.error('Error fetching transactions from Supabase:', error);
    throw error;
  }
};

// Создание новой транзакции
export const createTransactionInSupabase = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    // Преобразуем данные из формата приложения в формат Supabase
    const supabaseTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date.toISOString(), // Используем ISO строку для даты
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
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(supabaseTransaction)
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction in Supabase:', error);
      throw error;
    }

    // Возвращаем созданную транзакцию в формате приложения
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
      hasAllocations: data.has_allocations || false,
    };
  } catch (error) {
    console.error('Error creating transaction in Supabase:', error);
    throw error;
  }
};

// Обновление транзакции
export const updateTransactionInSupabase = async (transaction: Transaction): Promise<Transaction> => {
  try {
    // Преобразуем данные из формата приложения в формат Supabase
    const supabaseTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date.toISOString(), // Используем ISO строку для даты
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
    };

    const { data, error } = await supabase
      .from('transactions')
      .update(supabaseTransaction)
      .eq('id', transaction.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction in Supabase:', error);
      throw error;
    }

    // Возвращаем обновленную транзакцию в формате приложения
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
      hasAllocations: data.has_allocations || false,
    };
  } catch (error) {
    console.error('Error updating transaction in Supabase:', error);
    throw error;
  }
};

// Удаление транзакции
export const deleteTransactionFromSupabase = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting transaction from Supabase:', error);
    throw error;
  }
};

// Обновление статуса возмещения
export const updateTransactionStatusInSupabase = async (id: string, status: 'completed'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ reimbursement_status: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction status in Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating transaction status in Supabase:', error);
    throw error;
  }
};
