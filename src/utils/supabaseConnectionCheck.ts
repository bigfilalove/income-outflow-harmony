
import { supabase } from '@/lib/supabase';

/**
 * Check connection to Supabase with detailed diagnostics
 */
export const checkSupabaseConnectionDetailed = async () => {
  const result = {
    isConnected: false,
    details: {
      url: '',
      errorMessage: '',
      errorCode: '',
      fetchStatus: ''
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
