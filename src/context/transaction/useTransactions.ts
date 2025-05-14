
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
      } catch (error: any) {
        console.error('Error in transactions fetching:', error);
        
        // Only show toast for non-connection errors
        // Connection errors will be handled in the UI
        if (error.message && 
            !error.message.includes('Failed to fetch') && 
            !error.message.includes('network') && 
            !error.message.includes('connection') &&
            !error.message.includes('Supabase')) {
          toast({
            title: "Ошибка при загрузке данных",
            description: error.message || "Не удалось загрузить транзакции из Supabase",
            variant: "destructive"
          });
        }
        
        // Return empty array for failed fetches to allow UI to render
        // but still propagate the error for error handling
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry auth errors
      if (error instanceof Error && 
         (error.message.includes('401') || 
          error.message.includes('auth') || 
          error.message.includes('Authentication'))) {
        return false;
      }
      
      // Don't retry network/connection errors more than once
      if (error instanceof Error && 
         (error.message.includes('Failed to fetch') || 
          error.message.includes('network') || 
          error.message.includes('connection'))) {
        return failureCount < 1;
      }
      
      // Retry other errors twice
      return failureCount < 2;
    },
    meta: {
      onError: (error: unknown) => {
        console.error('Error in transactions query:', error);
        
        // Only pass auth errors to auth handler
        if (error instanceof Error && 
           (error.message.includes('401') || 
            error.message.includes('auth') || 
            error.message.includes('Authentication'))) {
          handleAuthError(error);
        }
      }
    },
    // Return empty array instead of undefined for failed queries
    // This allows components to still render with empty data
    placeholderData: []
  });
};
