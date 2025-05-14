
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';

export const useTransactionsQuery = (handleAuthError: (error: unknown) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactionsFromSupabase,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false; // Don't retry on auth errors
      }
      return failureCount < 1; // Retry once for other errors
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
