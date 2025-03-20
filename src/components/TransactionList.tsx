
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Search, 
  MoreVertical, 
  Filter, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { Transaction, TransactionType } from '@/types/transaction';
import { useTransactions } from '@/context/TransactionContext';
import { Badge } from '@/components/ui/badge';

type FilterType = 'all' | 'income' | 'expense' | 'reimbursement' | 'pending';

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                Все транзакции
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('income')}>
                Только доходы
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('expense')}>
                Только расходы
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('reimbursement')}>
                Только возмещения
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>
                Ожидающие возмещения
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск транзакций..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'completed') => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onDelete,
  onUpdateStatus
}) => {
  const getTypeIcon = () => {
    if (transaction.isReimbursement) {
      return <RefreshCw className="h-5 w-5" />;
    }
    return transaction.type === 'income' 
      ? <ArrowDownCircle className="h-5 w-5" /> 
      : <ArrowUpCircle className="h-5 w-5" />;
  };

  const getTypeClass = () => {
    if (transaction.isReimbursement) {
      return "bg-amber-100 text-amber-700";
    }
    return transaction.type === 'income' 
      ? "bg-green-100 text-income" 
      : "bg-red-100 text-expense";
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border transaction-item">
      <div className="flex items-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
          getTypeClass()
        )}>
          {getTypeIcon()}
        </div>
        <div>
          <div className="font-medium">{transaction.description}</div>
          <div className="text-xs text-muted-foreground">
            {transaction.category} • {formatDateShort(transaction.date)}
            {transaction.isReimbursement && transaction.reimbursedTo && (
              <> • Сотрудник: {transaction.reimbursedTo}</>
            )}
          </div>
          {transaction.isReimbursement && (
            <Badge 
              variant={transaction.reimbursementStatus === 'pending' ? 'outline' : 'default'} 
              className="mt-1"
            >
              {transaction.reimbursementStatus === 'pending' ? 'Ожидает возмещения' : 'Возмещено'}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <span className={cn(
          "font-medium mr-2",
          transaction.type === 'income' ? "text-income" : "text-expense"
        )}>
          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {transaction.isReimbursement && transaction.reimbursementStatus === 'pending' && onUpdateStatus && (
              <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, 'completed')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Отметить как возмещенное
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(transaction.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TransactionList;
