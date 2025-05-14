
import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Coins,
  Edit,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onUpdateStatus: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
  onEdit,
  onUpdateStatus,
}) => {
  // Format transaction date
  const formattedDate = format(new Date(transaction.date), 'dd MMMM yyyy', { locale: ru });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

  return (
    <div className={cn(
      "p-4 border rounded-lg hover:shadow-sm transition-shadow",
      transaction.type === 'income' ? "bg-green-50/30" : 
      transaction.type === 'expense' ? "bg-red-50/30" : 
      transaction.type === 'transfer' ? "bg-blue-50/30" : "",
      transaction.isInvestment && "bg-purple-50/30"
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="font-medium">{transaction.description}</div>
          <div className="text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="inline-block mr-1 h-3 w-3" /> {formattedDate}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">
              {transaction.category}
            </Badge>
            
            {transaction.company && (
              <Badge variant="secondary">
                {transaction.company}
              </Badge>
            )}
            
            {transaction.project && (
              <Badge variant="secondary" className="bg-blue-100">
                {transaction.project}
              </Badge>
            )}
            
            {transaction.isReimbursement && (
              <Badge variant={transaction.reimbursementStatus === 'completed' ? "default" : "destructive"}>
                {transaction.reimbursementStatus === 'completed' ? 'Возмещено' : 'Ожидает возмещения'}
              </Badge>
            )}
            
            {transaction.isInvestment && (
              <Badge variant="secondary" className="bg-purple-100">
                <Coins className="mr-1 h-3 w-3" />
                Инвестиция: {transaction.investor}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={cn(
            "font-semibold",
            transaction.type === 'income' ? "text-green-600" : 
            transaction.type === 'expense' ? "text-red-600" : 
            "text-blue-600"
          )}>
            {transaction.type === 'income' && <ArrowDownLeft className="inline-block mr-1 h-4 w-4" />}
            {transaction.type === 'expense' && <ArrowUpRight className="inline-block mr-1 h-4 w-4" />}
            {formatCurrency(transaction.amount)}
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)} title="Редактировать">
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Удалить">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Транзакция будет навсегда удалена.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(transaction.id)}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {transaction.isReimbursement && transaction.reimbursementStatus === 'pending' && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onUpdateStatus(transaction.id)}
                title="Отметить как возмещено"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
