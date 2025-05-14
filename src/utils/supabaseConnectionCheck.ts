
import { supabase } from '@/lib/supabase';

// Simple connection check
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try a simple query to test connection
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};

// More detailed connection check with diagnostics
export const checkSupabaseConnectionDetailed = async (): Promise<{
  isConnected: boolean;
  details: {
    timestamp: string;
    errorMessage?: string;
    errorCode?: string;
    duration?: number;
  };
}> => {
  const startTime = Date.now();
  try {
    // Try a simple query to test connection
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return {
        isConnected: false,
        details: {
          timestamp: new Date().toISOString(),
          errorMessage: error.message,
          errorCode: error.code,
          duration
        }
      };
    }
    
    return {
      isConnected: true,
      details: {
        timestamp: new Date().toISOString(),
        duration
      }
    };
  } catch (error: any) {
    const endTime = Date.now();
    console.error('Error in Supabase connection check:', error);
    
    return {
      isConnected: false,
      details: {
        timestamp: new Date().toISOString(),
        errorMessage: error?.message || 'Unknown error occurred',
        duration: endTime - startTime
      }
    };
  }
};
