
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { Transaction } from '@/types/transaction';
import TransactionItem from './TransactionItem';
import TransactionSearch from './TransactionSearch';
import TransactionFilter, { FilterType } from './TransactionFilter';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, updateReimbursementStatus } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.reimbursedTo && t.reimbursedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = false;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'pending') {
      matchesFilter = !!t.isReimbursement && t.reimbursementStatus === 'pending';
    } else {
      matchesFilter = t.type === filter || (filter === 'reimbursement' && !!t.isReimbursement);
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
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
      </CardHeader>
      <CardContent>
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
                onUpdateStatus={updateReimbursementStatus}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
