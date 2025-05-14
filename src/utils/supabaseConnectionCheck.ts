
import { supabase } from '@/lib/supabase';

/**
 * Detailed result type for Supabase connection check
 */
export interface ConnectionCheckResult {
  isConnected: boolean;
  details: {
    url: string;
    errorMessage: string;
    errorCode: string;
    fetchStatus: string;
    authEnabled?: boolean;
    tablesAccessible?: boolean;
  }
}

/**
 * Check connection to Supabase with detailed diagnostics
 */
export const checkSupabaseConnectionDetailed = async (): Promise<ConnectionCheckResult> => {
  const result: ConnectionCheckResult = {
    isConnected: false,
    details: {
      url: '',
      errorMessage: '',
      errorCode: '',
      fetchStatus: '',
      authEnabled: false,
      tablesAccessible: false
    }
  };
  
  try {
    // Get Supabase URL
    const supabaseUrl = (supabase as any).getUrl();
    result.details.url = supabaseUrl;
    
    // Check if the URL is valid
    if (!supabaseUrl) {
      throw new Error('Неверный URL Supabase');
    }
    
    // Try a simple query to test the connection
    const start = Date.now();
    const { data, error } = await supabase.from('transactions').select('count').limit(1);
    const elapsed = Date.now() - start;
    
    if (error) {
      throw error;
    }
    
    result.isConnected = true;
    result.details.fetchStatus = `Успешно (${elapsed}ms)`;
    result.details.tablesAccessible = true;
    
    // Check if auth is enabled
    try {
      await supabase.auth.getSession();
      result.details.authEnabled = true;
    } catch (authError) {
      result.details.authEnabled = false;
    }
    
    return result;
  } catch (error: any) {
    console.error('Error checking Supabase connection:', error);
    
    result.isConnected = false;
    result.details.errorMessage = error.message || 'Неизвестная ошибка';
    result.details.errorCode = error.code || 'UNKNOWN';
    result.details.fetchStatus = 'Ошибка';
    
    return result;
  }
};

/**
 * Simple function to check Supabase connection and notify the user
 * Used in Admin panel
 */
export const checkAndNotifySupabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await checkSupabaseConnectionDetailed();
    return result.isConnected;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};
