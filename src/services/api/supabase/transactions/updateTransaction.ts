
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';
import { toSupabaseTransaction, fromSupabaseTransaction } from './utils';

// Updating a transaction
export const updateTransactionInSupabase = async (transaction: Transaction): Promise<Transaction> => {
  try {
    // Convert transaction from app format to Supabase format
    const supabaseTransaction = toSupabaseTransaction(transaction);

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

    // Return the updated transaction in app format
    return fromSupabaseTransaction(data);
  } catch (error) {
    console.error('Error updating transaction in Supabase:', error);
    throw error;
  }
};

// Updating transaction reimbursement status
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
