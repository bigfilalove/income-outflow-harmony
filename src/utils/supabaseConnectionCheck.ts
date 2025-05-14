
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type ConnectionCheckResult = {
  isConnected: boolean;
  details: {
    url: string;
    authEnabled: boolean;
    tablesAccessible: boolean;
    errorMessage?: string;
  };
};

// Более подробная проверка соединения с Supabase
export const checkSupabaseConnectionDetailed = async (): Promise<ConnectionCheckResult> => {
  console.log('Running detailed Supabase connection check...');
  
  const result: ConnectionCheckResult = {
    isConnected: false,
    details: {
      url: 'https://rjumbzllcnboghomakdw.supabase.co', // Используем фиксированный URL из проекта
      authEnabled: false,
      tablesAccessible: false
    }
  };

  try {
    // Проверка аутентификации
    console.log('Checking Supabase auth connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Supabase auth check failed:', authError.message);
      result.details.errorMessage = `Auth error: ${authError.message}`;
      return result;
    }
    
    result.details.authEnabled = true;
    console.log('Supabase auth check successful');
    
    // Проверка доступа к таблицам (пробуем различные таблицы)
    console.log('Checking Supabase table access...');
    const tables = ['categories', 'transactions', 'companies'];
    let foundWorkingTable = false;
    let lastError = null;
    
    for (const table of tables) {
      try {
        console.log(`Trying to access table: ${table}`);
        const { data, error } = await supabase
          .from(table)
          .select('count(*)', { count: 'exact', head: true })
          .limit(1);
        
        if (!error) {
          console.log(`Successfully accessed table: ${table}`);
          foundWorkingTable = true;
          break;
        } else {
          console.warn(`Could not access table ${table}:`, error.message);
          lastError = error;
        }
      } catch (tableError) {
        console.error(`Error accessing table ${table}:`, tableError);
        lastError = tableError;
      }
    }
    
    result.details.tablesAccessible = foundWorkingTable;
    
    // Общая оценка соединения
    result.isConnected = result.details.authEnabled && result.details.tablesAccessible;
    
    if (!result.isConnected && !result.details.errorMessage) {
      result.details.errorMessage = lastError 
        ? `Ошибка доступа к таблицам: ${lastError.message}` 
        : 'Не удалось подключиться к таблицам базы данных. Возможно, требуется аутентификация или таблицы не существуют.';
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Fatal error during Supabase connection check:', error);
    result.details.errorMessage = errorMessage;
    return result;
  }
};

// Проверка и тост-уведомление
export const checkAndNotifySupabaseConnection = async (): Promise<boolean> => {
  try {
    const result = await checkSupabaseConnectionDetailed();
    
    if (result.isConnected) {
      toast({
        title: "Соединение с Supabase установлено",
        description: "База данных доступна и готова к работе"
      });
      return true;
    } else {
      toast({
        title: "Ошибка соединения с Supabase",
        description: result.details.errorMessage || "Не удалось подключиться к базе данных",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Ошибка при проверке соединения",
      description: "Произошла непредвиденная ошибка при проверке соединения",
      variant: "destructive"
    });
    return false;
  }
};
