
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTransactions } from '@/context/transaction';
import TransactionEditDialog from '../TransactionEditDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { checkSupabaseConnection } from '@/lib/supabase';
import { Transaction } from '@/types/transaction';
import { FilterType } from '../TransactionFilter';
import TransactionListHeader from './TransactionListHeader';
import TransactionListContent from './TransactionListContent';

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

  // Safe access to transactions with fallback to empty array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTransactions = safeTransactions.filter(t => {
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
    } else if (filter === 'investment') {
      matchesFilter = !!t.isInvestment || 
                     t.category === 'Вклад собственника' ||
                     t.category === 'Инвестиции партнера';
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

  return (
    <>
      <Card className="animate-slideUp">
        <TransactionListHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setFilter={setFilter}
          error={error}
          isCheckingConnection={checkingConnection}
          isSupabaseConnected={isSupabaseConnected}
          transactionsEmpty={filteredTransactions.length === 0}
          isLoading={isLoading}
        />
        
        <TransactionListContent 
          isLoading={isLoading}
          transactions={filteredTransactions}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={handleEdit}
          onUpdateStatus={handleUpdateStatus}
        />
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
