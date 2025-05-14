
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';
import { mapServerToClient, mapClientToServer } from '../mappers';

// Получить все транзакции
export const fetchTransactionsSupabase = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Адаптируем данные к формату Transaction
    return data.map(item => {
      const serverFormat = {
        _id: item.id,
        amount: item.amount,
        description: item.description,
        category: item.category,
        date: item.date,
        type: item.type,
        isReimbursement: item.is_reimbursement,
        reimbursedTo: item.reimbursed_to,
        reimbursementStatus: item.reimbursement_status,
        createdBy: item.created_by,
        createdAt: item.created_at,
        company: item.company,
        project: item.project,
        isTransfer: item.is_transfer,
        fromCompany: item.from_company,
        toCompany: item.to_company,
        hasAllocations: item.has_allocations
      };
      
      return mapServerToClient(serverFormat);
    });
  } catch (error) {
    console.error('Error fetching transactions from Supabase:', error);
    return [];
  }
};

// Создать новую транзакцию
export const createTransactionSupabase = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> => {
  try {
    const serverTransaction = mapClientToServer(transaction);
    
    // Преобразуем формат для Supabase
    const supabaseTransaction = {
      amount: serverTransaction.amount,
      description: serverTransaction.description,
      category: serverTransaction.category,
      date: serverTransaction.date,
      type: serverTransaction.type,
      is_reimbursement: serverTransaction.isReimbursement,
      reimbursed_to: serverTransaction.reimbursedTo,
      reimbursement_status: serverTransaction.reimbursementStatus,
      created_by: serverTransaction.createdBy,
      created_at: serverTransaction.createdAt,
      company: serverTransaction.company,
      project: serverTransaction.project,
      is_transfer: serverTransaction.isTransfer,
      from_company: serverTransaction.fromCompany,
      to_company: serverTransaction.toCompany,
      has_allocations: serverTransaction.hasAllocations
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(supabaseTransaction)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Преобразуем обратно в формат Transaction
    const serverFormat = {
      _id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date,
      type: data.type,
      isReimbursement: data.is_reimbursement,
      reimbursedTo: data.reimbursed_to,
      reimbursementStatus: data.reimbursement_status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      company: data.company,
      project: data.project,
      isTransfer: data.is_transfer,
      fromCompany: data.from_company,
      toCompany: data.to_company,
      hasAllocations: data.has_allocations
    };
    
    return mapServerToClient(serverFormat);
  } catch (error) {
    console.error('Error creating transaction in Supabase:', error);
    return null;
  }
};

// Обновить транзакцию
export const updateTransactionSupabase = async (transaction: Transaction): Promise<Transaction | null> => {
  try {
    const serverTransaction = mapClientToServer(transaction);
    
    // Преобразуем формат для Supabase
    const supabaseTransaction = {
      amount: serverTransaction.amount,
      description: serverTransaction.description,
      category: serverTransaction.category,
      date: serverTransaction.date,
      type: serverTransaction.type,
      is_reimbursement: serverTransaction.isReimbursement,
      reimbursed_to: serverTransaction.reimbursedTo,
      reimbursement_status: serverTransaction.reimbursementStatus,
      created_by: serverTransaction.createdBy,
      created_at: serverTransaction.createdAt,
      company: serverTransaction.company,
      project: serverTransaction.project,
      is_transfer: serverTransaction.isTransfer,
      from_company: serverTransaction.fromCompany,
      to_company: serverTransaction.toCompany,
      has_allocations: serverTransaction.hasAllocations
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
    
    // Преобразуем обратно в формат Transaction
    const serverFormat = {
      _id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date,
      type: data.type,
      isReimbursement: data.is_reimbursement,
      reimbursedTo: data.reimbursed_to,
      reimbursementStatus: data.reimbursement_status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      company: data.company,
      project: data.project,
      isTransfer: data.is_transfer,
      fromCompany: data.from_company,
      toCompany: data.to_company,
      hasAllocations: data.has_allocations
    };
    
    return mapServerToClient(serverFormat);
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
export const updateTransactionStatusSupabase = async (id: string, status: 'completed'): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ reimbursement_status: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Преобразуем обратно в формат Transaction
    const serverFormat = {
      _id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date,
      type: data.type,
      isReimbursement: data.is_reimbursement,
      reimbursedTo: data.reimbursed_to,
      reimbursementStatus: data.reimbursement_status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      company: data.company,
      project: data.project,
      isTransfer: data.is_transfer,
      fromCompany: data.from_company,
      toCompany: data.to_company,
      hasAllocations: data.has_allocations
    };
    
    return mapServerToClient(serverFormat);
  } catch (error) {
    console.error('Error updating transaction status in Supabase:', error);
    return null;
  }
};
