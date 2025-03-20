
import React from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  MoreVertical, 
  Trash2,
  RefreshCw,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { cn } from '@/lib/utils';

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
            {transaction.createdBy && (
              <> • <User className="h-3 w-3 inline mb-0.5" /> {transaction.createdBy}</>
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

export default TransactionItem;
