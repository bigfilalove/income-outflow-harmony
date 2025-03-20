
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
  Trash2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { Transaction, TransactionType } from '@/types/transaction';
import { useTransactions } from '@/context/TransactionContext';

type FilterType = 'all' | 'income' | 'expense';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || t.type === filter;
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
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border transaction-item">
      <div className="flex items-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
          transaction.type === 'income' 
            ? "bg-green-100 text-income" 
            : "bg-red-100 text-expense"
        )}>
          {transaction.type === 'income' 
            ? <ArrowDownCircle className="h-5 w-5" /> 
            : <ArrowUpCircle className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-medium">{transaction.description}</div>
          <div className="text-xs text-muted-foreground">
            {transaction.category} • {formatDateShort(transaction.date)}
          </div>
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
