
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';
import { toast } from '@/components/ui/use-toast';

export const useTransactionsQuery = (handleAuthError: (error: unknown) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
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
