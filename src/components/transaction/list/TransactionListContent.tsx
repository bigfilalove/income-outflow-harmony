
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@/types/transaction';
import TransactionItem from '../TransactionItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionListContentProps {
  isLoading: boolean;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => Promise<void>;
  onEditTransaction: (transaction: Transaction) => void;
  onUpdateStatus: (id: string) => void;
}

const TransactionListContent: React.FC<TransactionListContentProps> = ({
  isLoading,
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  onUpdateStatus
}) => {
  const isMobile = useIsMobile();
  
  return (
    <CardContent>
      <div className={`space-y-4 ${isMobile ? 'max-h-[calc(100vh-220px)]' : 'max-h-[calc(100vh-280px)]'} overflow-y-auto pr-1`}>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Транзакции не найдены
              </div>
            ) : (
              transactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  onDelete={onDeleteTransaction}
                  onEdit={onEditTransaction}
                  onUpdateStatus={onUpdateStatus}
                />
              ))
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default TransactionListContent;
