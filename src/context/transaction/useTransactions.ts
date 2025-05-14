
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useTransactionsQuery = (handleAuthError: (error: unknown) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        // First check connection to Supabase
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('Не удалось подключиться к Supabase. Проверьте настройки соединения.');
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: unknown) => {
        console.error('Error in transactions query:', error);
        handleAuthError(error);
      }
    }
  });
};

// Helper function to check Supabase connection
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('transactions').select('count()', { count: 'exact', head: true });
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};
