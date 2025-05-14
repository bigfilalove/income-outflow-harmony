
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ConnectionCheckResult {
  url: string;
  errorMessage: string;
  errorCode: string;
  fetchStatus: string;
  tablesAccessible?: boolean;
}

export const checkSupabaseConnection = async (): Promise<ConnectionCheckResult> => {
  try {
    // Test the connection to Supabase
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return {
        url: supabase.supabaseUrl,
        errorMessage: error.message,
        errorCode: error.code,
        fetchStatus: 'error',
        tablesAccessible: false
      };
    }
    
    return {
      url: supabase.supabaseUrl,
      errorMessage: '',
      errorCode: '',
      fetchStatus: 'success',
      tablesAccessible: true
    };
    
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    
    return {
      url: supabase.supabaseUrl,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorCode: 'UNKNOWN',
      fetchStatus: 'failed',
      tablesAccessible: false
    };
  }
};

export const checkAndNotifySupabaseConnection = async (): Promise<boolean> => {
  const result = await checkSupabaseConnection();
  
  if (result.tablesAccessible) {
    toast.success('Соединение с Supabase установлено');
    return true;
  } else {
    toast.error(`Ошибка соединения с Supabase: ${result.errorMessage}`);
    return false;
  }
};
