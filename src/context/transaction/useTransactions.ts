
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/services/api';

export const useTransactionsQuery = (handleAuthError: (error: any) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    meta: {
      onError: (error: any) => {
        handleAuthError(error);
      }
    }
  });
};
