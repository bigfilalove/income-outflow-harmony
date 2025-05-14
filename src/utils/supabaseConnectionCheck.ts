
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface ConnectionCheckResult {
  url: string;
  errorMessage: string;
  errorCode: string;
  fetchStatus: string;
  tablesAccessible?: boolean;
  isConnected: boolean;
  details: {
    url: string;
    errorMessage: string;
    errorCode: string;
    authEnabled?: boolean;
    tablesAccessible?: boolean;
  };
}

export const checkSupabaseConnection = async (): Promise<ConnectionCheckResult> => {
  try {
    // Test the connection to Supabase
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return {
        url: supabase.getUrl ? supabase.getUrl() : '',
        errorMessage: error.message,
        errorCode: error.code,
        fetchStatus: 'error',
        tablesAccessible: false,
        isConnected: false,
        details: {
          url: supabase.getUrl ? supabase.getUrl() : '',
          errorMessage: error.message,
          errorCode: error.code,
          authEnabled: false,
          tablesAccessible: false
        }
      };
    }
    
    return {
      url: supabase.getUrl ? supabase.getUrl() : '',
      errorMessage: '',
      errorCode: '',
      fetchStatus: 'success',
      tablesAccessible: true,
      isConnected: true,
      details: {
        url: supabase.getUrl ? supabase.getUrl() : '',
        errorMessage: '',
        errorCode: '',
        authEnabled: true,
        tablesAccessible: true
      }
    };
    
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    
    return {
      url: supabase.getUrl ? supabase.getUrl() : '',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorCode: 'UNKNOWN',
      fetchStatus: 'failed',
      tablesAccessible: false,
      isConnected: false,
      details: {
        url: supabase.getUrl ? supabase.getUrl() : '',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'UNKNOWN',
        authEnabled: false,
        tablesAccessible: false
      }
    };
  }
};

// Add the detailed connection check function that was missing
export const checkSupabaseConnectionDetailed = async (): Promise<ConnectionCheckResult> => {
  // For now, this is just a wrapper around the basic check
  return await checkSupabaseConnection();
};

export const checkAndNotifySupabaseConnection = async (): Promise<boolean> => {
  const result = await checkSupabaseConnection();
  
  if (result.isConnected) {
    toast({
      title: "Соединение с Supabase установлено",
      description: "Успешное подключение к Supabase"
    });
    return true;
  } else {
    toast({
      title: "Ошибка соединения с Supabase",
      description: result.errorMessage,
      variant: "destructive"
    });
    return false;
  }
};
