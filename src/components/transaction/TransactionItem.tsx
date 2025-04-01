
import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  MoreVertical,
  PencilIcon,
  TrashIcon,
  CornerRightDown,
  Split,
} from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const isIncome = transaction.type === 'income';
  const isReimbursement = transaction.isReimbursement;
  const isTransfer = transaction.type === 'transfer';
  const isPendingReimbursement = isReimbursement && transaction.reimbursementStatus === 'pending';

  let icon;
  if (isTransfer) {
    icon = <CornerRightDown className="text-blue-500" />;
  } else if (isReimbursement) {
    icon = <Clock className={`text-orange-500`} />;
  } else if (isIncome) {
    icon = <ArrowUpRight className="text-green-500" />;
  } else {
    icon = <ArrowDownRight className="text-red-500" />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-3">
          <div className="mt-1">{icon}</div>
          <div>
            <h3 className="font-medium flex items-center gap-2">
              {transaction.description}
              {transaction.hasAllocations && (
                <Badge variant="outline" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-0">
                  <Split className="h-3 w-3 mr-1" /> Распределено
                </Badge>
              )}
              {isPendingReimbursement && (
                <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-0">
                  Ожидает возмещения
                </Badge>
              )}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(transaction.date)}
              {transaction.createdBy && ` · ${transaction.createdBy}`}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {transaction.category}
              </Badge>
              {transaction.company && (
                <Badge variant="outline" className="text-xs">
                  {transaction.company}
                </Badge>
              )}
              {transaction.project && !transaction.hasAllocations && (
                <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-100 dark:border-purple-800">
                  {transaction.project}
                </Badge>
              )}
              {isTransfer && transaction.fromCompany && transaction.toCompany && (
                <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800">
                  {transaction.fromCompany} → {transaction.toCompany}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className={`font-bold text-right ${isIncome ? 'text-green-500' : 'text-red-500'} ${isTransfer ? 'text-blue-500' : ''}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <PencilIcon className="mr-2 h-4 w-4" /> Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(transaction.id)}>
                <TrashIcon className="mr-2 h-4 w-4" /> Удалить
              </DropdownMenuItem>
              {isPendingReimbursement && onUpdateStatus && (
                <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id)}>
                  <Clock className="mr-2 h-4 w-4" /> Отметить как возмещено
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {transaction.hasAllocations && transaction.projectAllocations && transaction.projectAllocations.length > 0 && (
        <Collapsible className="mt-2">
          <CollapsibleTrigger asChild>
            <Button variant="link" size="sm" className="p-0 h-auto text-xs flex items-center">
              Показать распределение по проектам
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 border-t pt-2 border-dashed">
            <div className="text-sm text-muted-foreground mb-1">Распределение по проектам:</div>
            <div className="space-y-1">
              {transaction.projectAllocations.map((allocation, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-100 dark:border-purple-800">
                    {allocation.project}
                  </Badge>
                  <span className={`font-medium ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(allocation.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default TransactionItem;
