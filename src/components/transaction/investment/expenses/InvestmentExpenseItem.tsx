
import React from 'react';
import { InvestmentExpense } from '@/types/investment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface InvestmentExpenseItemProps {
  expense: InvestmentExpense;
  onDelete: (id: string) => void;
}

const InvestmentExpenseItem: React.FC<InvestmentExpenseItemProps> = ({
  expense,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex justify-between items-start p-4">
          <div className="space-y-1">
            <div className="font-medium">{expense.description}</div>
            <div className="text-sm text-muted-foreground">
              Категория: {expense.category}
            </div>
            {expense.project && (
              <div className="text-sm text-muted-foreground">
                Проект: {expense.project}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Дата: {formatDate(expense.date)}
            </div>
            {expense.created_by && (
              <div className="text-xs text-muted-foreground">
                Создал: {expense.created_by}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="font-semibold text-destructive">
              -{formatCurrency(expense.amount)}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(expense.id)}
              aria-label="Удалить расход"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentExpenseItem;
