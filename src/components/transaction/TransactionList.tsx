
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useTransactions } from '@/context/transaction';
import TransactionItem from './TransactionItem';
import TransactionSearch from './TransactionSearch';
import TransactionFilter, { FilterType } from './TransactionFilter';
import TransactionEditDialog from './TransactionEditDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@/types/transaction';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { checkSupabaseConnection } from '@/lib/supabase';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TransactionList: React.FC = () => {
  const { transactions, isLoading, error, deleteTransaction, updateReimbursementStatus } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const isMobile = useIsMobile();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setCheckingConnection(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsSupabaseConnected(connected);
      } catch (e) {
        console.error("Error checking Supabase connection:", e);
        setIsSupabaseConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    };
    
    checkConnection();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.reimbursedTo && t.reimbursedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (t.company && t.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (t.project && t.project.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = false;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'pending') {
      matchesFilter = !!t.isReimbursement && t.reimbursementStatus === 'pending';
    } else if (filter.startsWith('company:')) {
      // Фильтрация по компании
      const companyFilter = filter.replace('company:', '');
      matchesFilter = t.company === companyFilter;
    } else if (filter.startsWith('project:')) {
      // Фильтрация по проекту
      const projectFilter = filter.replace('project:', '');
      matchesFilter = t.project === projectFilter;
    } else {
      matchesFilter = t.type === filter || (filter === 'reimbursement' && !!t.isReimbursement);
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEditDialog = () => {
    setEditingTransaction(null);
  };

  // Create a wrapper function to handle the status update with correct parameters
  const handleUpdateStatus = (id: string) => {
    updateReimbursementStatus(id, 'completed');
  };

  // Connection status component
  const renderConnectionStatus = () => {
    if (checkingConnection) {
      return <div className="animate-pulse text-center py-2 text-muted-foreground">Проверка соединения с Supabase...</div>;
    } else if (isSupabaseConnected === false) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка соединения</AlertTitle>
          <AlertDescription>
            Не удалось подключиться к Supabase. Проверьте настройки подключения и убедитесь, что сервис доступен.
          </AlertDescription>
        </Alert>
      );
    } else if (isSupabaseConnected === true && transactions.length === 0 && !isLoading) {
      return (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Подключение успешно</AlertTitle>
          <AlertDescription>
            Подключение к Supabase установлено, но транзакции не найдены. Возможно, вам нужно добавить данные.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="animate-slideUp">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Транзакции</CardTitle>
              <CardDescription>История всех операций</CardDescription>
            </div>
            <TransactionFilter setFilter={setFilter} />
          </div>
          <TransactionSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {renderConnectionStatus()}
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
        <CardContent>
          <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
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
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Транзакции не найдены
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction}
                      onDelete={deleteTransaction}
                      onEdit={handleEdit}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isMobile ? (
        <Sheet open={!!editingTransaction} onOpenChange={handleCloseEditDialog}>
          <SheetContent side="bottom" className="h-[90vh] pt-6">
            <SheetHeader>
              <SheetTitle>Редактировать транзакцию</SheetTitle>
            </SheetHeader>
            {editingTransaction && (
              <div className="mt-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <TransactionEditDialog 
                  transaction={editingTransaction}
                  isOpen={true}
                  onClose={handleCloseEditDialog}
                />
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <TransactionEditDialog 
          transaction={editingTransaction}
          isOpen={!!editingTransaction}
          onClose={handleCloseEditDialog}
        />
      )}
    </>
  );
};

export default TransactionList;
