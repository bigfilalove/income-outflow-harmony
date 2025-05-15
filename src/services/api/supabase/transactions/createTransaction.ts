
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';
import { toSupabaseTransaction, fromSupabaseTransaction } from './utils';

// Creating a new transaction
export const createTransactionInSupabase = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    console.log('Creating transaction:', transaction);
    
    // Convert transaction from app format to Supabase format
    const supabaseTransaction = toSupabaseTransaction(transaction);
    
    console.log('Supabase transaction data:', supabaseTransaction);

    const { data, error } = await supabase
      .from('transactions')
      .insert(supabaseTransaction)
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction in Supabase:', error);
      throw error;
    }

    console.log('Transaction created successfully:', data);

    // Return the created transaction in app format
    return fromSupabaseTransaction(data);
  } catch (error) {
    console.error('Error creating transaction in Supabase:', error);
    throw error;
  }
};
