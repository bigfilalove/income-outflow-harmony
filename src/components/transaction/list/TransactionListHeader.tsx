
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import TransactionFilter, { FilterType } from '../TransactionFilter';
import TransactionSearch from '../TransactionSearch';
import TransactionConnectionStatus from './TransactionConnectionStatus';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilter: (filter: FilterType) => void;
  error: Error | null;
  isCheckingConnection: boolean;
  isSupabaseConnected: boolean | null;
  transactionsEmpty: boolean;
  isLoading: boolean;
}

const TransactionListHeader: React.FC<TransactionListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  setFilter,
  error,
  isCheckingConnection,
  isSupabaseConnected,
  transactionsEmpty,
  isLoading
}) => {
  const isMobile = useIsMobile();
  
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Транзакции</CardTitle>
          <CardDescription>История всех операций</CardDescription>
        </div>
        <TransactionFilter setFilter={setFilter} />
      </div>
      
      <div className="mt-4">
        <TransactionSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      <TransactionConnectionStatus 
        isChecking={isCheckingConnection}
        isConnected={isSupabaseConnected}
        isEmpty={transactionsEmpty}
        isLoading={isLoading}
      />
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки данных</AlertTitle>
          <AlertDescription>
            {error.message || "Произошла ошибка при загрузке транзакций"}
          </AlertDescription>
        </Alert>
      )}
    </CardHeader>
  );
};

export default TransactionListHeader;
