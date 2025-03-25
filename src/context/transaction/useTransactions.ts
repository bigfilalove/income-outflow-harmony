import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/services/api';

export const useTransactionsQuery = (handleAuthError: (error: unknown) => void) => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false; // Не повторять запрос при ошибке 401
      }
      return failureCount < 1; // Повторить 1 раз при других ошибках
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    meta: {
      onError: (error: unknown) => {
        handleAuthError(error);
      }
    }
  });
};