
import { supabase } from '@/lib/supabase';

// Deleting a transaction
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
