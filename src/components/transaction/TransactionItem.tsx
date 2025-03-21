
import React from 'react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction';
import { 
  Building2, 
  BadgeCheck, 
  Clock, 
  Trash2, 
  Edit2, 
  Tag, 
  User, 
  Landmark
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => Promise<void>;
  onEdit: (transaction: Transaction) => void;
  onUpdateStatus: (id: string, status: 'completed') => Promise<void>;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onDelete,
  onEdit,
  onUpdateStatus
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    await onDelete(transaction.id);
    setIsDeleteDialogOpen(false);
  };

  const handleUpdateStatus = async () => {
    await onUpdateStatus(transaction.id, 'completed');
  };

  // Определяем цвет и стиль в зависимости от типа транзакции
  const getAmountStyles = () => {
    switch (transaction.type) {
      case 'income':
        return 'text-green-600 font-semibold';
      case 'expense':
        return 'text-red-600 font-semibold';
      default:
        return 'text-gray-600 font-semibold';
    }
  };

  const amountPrefix = transaction.type === 'income' ? '+' : '-';
  const formattedAmount = `${amountPrefix} ${formatCurrency(transaction.amount)}`;

  return (
    <>
      <div className="p-4 border rounded-lg transition-all hover:bg-muted/50">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{transaction.description}</h4>
            <div className="text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  {transaction.category}
                </span>
                
                {transaction.company && (
                  <span className="flex items-center">
                    <Building2 className="mr-1 h-3 w-3" />
                    {transaction.company}
                  </span>
                )}
                
                {transaction.project && (
                  <span className="flex items-center">
                    <Landmark className="mr-1 h-3 w-3" />
                    {transaction.project}
                  </span>
                )}
                
                {transaction.createdBy && (
                  <span className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {transaction.createdBy}
                  </span>
                )}
                
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDate(transaction.date)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={getAmountStyles()}>
              {formattedAmount}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                
                <DropdownMenuItem onClick={() => onEdit(transaction)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
                
                {transaction.isReimbursement && transaction.reimbursementStatus === 'pending' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleUpdateStatus}>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Отметить как возмещенное
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {transaction.isReimbursement && (
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant={transaction.reimbursementStatus === 'pending' ? 'outline' : 'default'}>
              {transaction.reimbursementStatus === 'pending' ? 'Ожидает возмещения' : 'Возмещено'}
            </Badge>
            {transaction.reimbursedTo && (
              <span className="text-xs text-muted-foreground">
                Кому: {transaction.reimbursedTo}
              </span>
            )}
          </div>
        )}
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить транзакцию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Транзакция "{transaction.description}" будет удалена.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionItem;
