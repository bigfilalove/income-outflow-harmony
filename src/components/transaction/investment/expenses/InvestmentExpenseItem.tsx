
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { InvestmentExpense } from '@/types/investment';

interface InvestmentExpenseItemProps {
  expense: InvestmentExpense;
  onDelete: (id: string) => void;
}

const InvestmentExpenseItem: React.FC<InvestmentExpenseItemProps> = ({ expense, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="font-medium">{expense.description}</div>
            <div className="text-sm text-muted-foreground">
              {expense.category}
              {expense.project && ` · ${expense.project}`}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(expense.date)}
              {expense.created_by && ` · ${expense.created_by}`}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="font-semibold text-destructive">
              -{formatCurrency(expense.amount)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(expense.id)}
              title="Удалить"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentExpenseItem;
