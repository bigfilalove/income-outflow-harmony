
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InvestmentExpense } from '@/types/investment';
import { fetchInvestmentExpenses, deleteInvestmentExpense } from '@/services/api/supabase/investments/investment-expenses';
import InvestmentExpenseItem from './InvestmentExpenseItem';
import { toast } from 'sonner';
import { AlertCircle, Trash2, Plus, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import ExistingExpensesToInvestmentDialog from './ExistingExpensesToInvestmentDialog';

interface InvestmentExpensesListProps {
  investmentId: string;
}

const InvestmentExpensesList: React.FC<InvestmentExpensesListProps> = ({ investmentId }) => {
  const [isExistingExpensesDialogOpen, setIsExistingExpensesDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['investment-expenses', investmentId],
    queryFn: () => fetchInvestmentExpenses(investmentId),
  });

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
      try {
        await deleteInvestmentExpense(expenseId);
        await queryClient.invalidateQueries({ queryKey: ['investment-expenses', investmentId] });
        toast.success('Расход успешно удален');
      } catch (error: any) {
        toast.error(`Ошибка удаления: ${error.message}`);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Ошибка загрузки расходов: {error instanceof Error ? error.message : 'Неизвестная ошибка'}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Расходы инвестиции</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsExistingExpensesDialogOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Добавить существующие
          </Button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Расходы пока не добавлены</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {expenses.map((expense) => (
              <InvestmentExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={() => handleDelete(expense.id)}
              />
            ))}
          </div>
          
          <div className="mt-4 p-3 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="font-medium">Всего расходов:</span>
              <span className="font-bold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Количество позиций:</span>
              <span>{expenses.length}</span>
            </div>
          </div>
        </>
      )}

      <ExistingExpensesToInvestmentDialog 
        isOpen={isExistingExpensesDialogOpen}
        onClose={() => setIsExistingExpensesDialogOpen(false)}
        investmentId={investmentId}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['investment-expenses', investmentId] })}
      />
    </div>
  );
};

export default InvestmentExpensesList;
