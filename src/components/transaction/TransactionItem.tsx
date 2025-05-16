
import React from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Check, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import classNames from 'classnames';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => Promise<void>;
  onEdit: (transaction: Transaction) => void;
  onUpdateStatus: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onDelete, 
  onEdit,
  onUpdateStatus
}) => {
  const isMobile = useIsMobile();
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      try {
        await onDelete(id);
      } catch (error: any) {
        console.error("Ошибка при удалении транзакции:", error.message);
        alert("Не удалось удалить транзакцию. Пожалуйста, попробуйте еще раз.");
      }
    }
  };

  // Check if transaction is a true investment (owner contribution or company investment)
  const isInvestment = transaction.isInvestment || 
                      transaction.category === 'Вклад собственника' ||
                      transaction.category === 'Инвестиции партнера';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={classNames(
          "p-4",
          transaction.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 
          transaction.type === 'expense' ? 'bg-destructive/10' : 'bg-blue-50 dark:bg-blue-900/20'
        )}>
          <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'}`}>
            {/* Основное содержимое транзакции */}
            <div className="space-y-1">
              <div className="font-medium">{transaction.description}</div>
              <div className="text-sm text-muted-foreground">
                {transaction.category}
                {transaction.company && ` · ${transaction.company}`}
                {transaction.project && ` · ${transaction.project}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(transaction.date)}
                {transaction.createdBy && ` · ${transaction.createdBy}`}
              </div>
              
              {/* Информация о возмещении */}
              {transaction.isReimbursement && (
                <div className="text-xs flex items-center flex-wrap">
                  <Badge variant={transaction.reimbursementStatus === 'completed' ? 'outline' : 'secondary'} className="mr-2 mb-1">
                    {transaction.reimbursementStatus === 'completed' ? 'Возмещено' : 'Ожидает возмещения'}
                  </Badge>
                  <span className="text-muted-foreground">Кому: {transaction.reimbursedTo}</span>
                </div>
              )}
              
              {/* Информация о переводе */}
              {transaction.isTransfer && (
                <div className="text-xs">
                  <Badge variant="outline" className="mr-2">Перевод</Badge>
                  <span className="text-muted-foreground">
                    {transaction.fromCompany} → {transaction.toCompany}
                  </span>
                </div>
              )}
              
              {/* Информация об инвестиции */}
              {isInvestment && (
                <div className="text-xs flex items-center">
                  <Badge variant="outline" className="mr-2">Инвестиция</Badge>
                  {transaction.investor && (
                    <span className="text-muted-foreground">Инвестор: {transaction.investor}</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Сумма и кнопки */}
            <div className={`${isMobile ? 'flex justify-between items-center mt-2 pt-2 border-t' : 'flex flex-col items-end space-y-2'}`}>
              <div className={classNames(
                "font-semibold",
                transaction.type === 'income' ? "text-green-600 dark:text-green-400" : 
                transaction.type === 'expense' ? "text-destructive" : "text-blue-600 dark:text-blue-400"
              )}>
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                {formatCurrency(transaction.amount)}
              </div>
              <div className="flex space-x-1">
                {transaction.isReimbursement && transaction.reimbursementStatus === 'pending' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdateStatus(transaction.id)}
                    title="Отметить как возмещено"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  title="Редактировать"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                  title="Удалить"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                
                {/* Кнопка для управления расходами инвестиции */}
                {isInvestment && (
                  <Link to={`/investment-expenses?id=${transaction.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Управление расходами"
                    >
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionItem;
