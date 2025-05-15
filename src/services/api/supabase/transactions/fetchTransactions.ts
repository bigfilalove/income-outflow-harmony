
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';
import { fromSupabaseTransaction } from './utils';

// Fetching all transactions
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

    // Convert data from Supabase to app format
    return data.map(fromSupabaseTransaction);
  } catch (error) {
    console.error('Error fetching transactions from Supabase:', error);
    throw error;
  }
};

// Fetching investment report
export const fetchInvestmentReportFromSupabase = async (
  startDate?: Date, 
  endDate?: Date, 
  company?: string, 
  investor?: string
): Promise<any> => {
  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('is_investment', true);
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    if (company) {
      query = query.eq('company', company);
    }
    
    if (investor) {
      query = query.eq('investor', investor);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching investment report from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching investment report from Supabase:', error);
    throw error;
  }
};
