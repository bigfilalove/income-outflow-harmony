
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';
import { toast } from '@/hooks/use-toast';
import { checkSupabaseConnectionDetailed } from '@/utils/supabaseConnectionCheck';

export const useTransactionsQuery = (handleAuthError: (error: unknown) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        // First check connection to Supabase with detailed diagnostics
        console.log('Checking Supabase connection before fetching transactions...');
        const connectionResult = await checkSupabaseConnectionDetailed();
        
        if (!connectionResult.isConnected) {
          console.error('Failed to connect to Supabase:', connectionResult.details);
          throw new Error(connectionResult.details.errorMessage || 'Не удалось подключиться к Supabase. Проверьте настройки соединения.');
        }

        console.log('Fetching transactions from Supabase...');
        const data = await fetchTransactionsFromSupabase();
        console.log('Fetched transactions:', data);
        return data;
      } catch (error) {
        console.error('Error in transactions fetching:', error);
        toast({
          title: "Ошибка при загрузке данных",
          description: "Не удалось загрузить транзакции из Supabase",
          variant: "destructive"
        });
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false; // Don't retry on auth errors
      }
      return failureCount < 2; // Retry twice for other errors
    },
    meta: {
      onError: (error: unknown) => {
        console.error('Error in transactions query:', error);
        handleAuthError(error);
      }
    }
  });
};
