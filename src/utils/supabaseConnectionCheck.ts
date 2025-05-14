import { supabase } from '@/lib/supabase';

/**
 * Define the type for connection check results
 */
export interface ConnectionCheckResult {
  isConnected: boolean;
  details: {
    url?: string;
    authEnabled?: boolean;
    tablesAccessible?: boolean;
    errorMessage?: string;
    error?: any; // This allows storing any error object
  };
}

/**
 * Detailed connection check with diagnostics
 */
export const checkSupabaseConnectionDetailed = async (): Promise<ConnectionCheckResult> => {
  const result: ConnectionCheckResult = {
    isConnected: false,
    details: {
      url: supabase.getUrl(), // Now properly typed
      authEnabled: false,
      tablesAccessible: false,
      errorMessage: ''
    }
  };

  try {
    // Check auth system
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      result.details.errorMessage = `Ошибка аутентификации: ${authError.message}`;
      result.details.error = authError;
      return result;
    }
    
    result.details.authEnabled = true;

    // Try to access different tables to diagnose problems
    const tables = ['categories', 'transactions', 'companies'];
    
    for (const table of tables) {
      console.log(`Trying to access table: ${table}`);
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.warn(`Could not access table ${table}: `, error);
          result.details.errorMessage = `Ошибка доступа к таблице ${table}: ${error.message}`;
          result.details.error = error;
        } else {
          // If we successfully access at least one table, mark as accessible
          result.details.tablesAccessible = true;
        }
      } catch (e) {
        console.warn(`Could not access table ${table}: `, e);
      }
    }
    
    // Connection is good if auth works and at least one table is accessible
    result.isConnected = result.details.authEnabled && result.details.tablesAccessible;
    
    if (!result.isConnected && !result.details.errorMessage) {
      result.details.errorMessage = 'Ошибка доступа к таблицам: ';
    }
    
    return result;
  } catch (error) {
    console.error('Fatal error checking Supabase connection:', error);
    result.details.errorMessage = `Критическая ошибка соединения: ${error instanceof Error ? error.message : String(error)}`;
    result.details.error = error;
    return result;
  }
};

/**
 * Simple connection check that returns boolean
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await checkSupabaseConnectionDetailed();
    return result.isConnected;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};

/**
 * Check connection and show toast notification with result
 */
export const checkAndNotifySupabaseConnection = async (): Promise<boolean> => {
  try {
    const connectionResult = await checkSupabaseConnectionDetailed();
    return connectionResult.isConnected;
  } catch (error) {
    console.error('Error in connection check:', error);
    return false;
  }
};
