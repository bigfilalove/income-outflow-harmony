
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvestmentExpenses, deleteInvestmentExpense } from '@/services/api/supabase/investments/investment-expenses';
import { InvestmentExpense } from '@/types/investment';
import InvestmentExpenseItem from './InvestmentExpenseItem';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface InvestmentExpensesListProps {
  investmentId: string;
}

const InvestmentExpensesList: React.FC<InvestmentExpensesListProps> = ({ investmentId }) => {
  const queryClient = useQueryClient();

  // Запрос на получение расходов
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['investment-expenses', investmentId],
    queryFn: () => fetchInvestmentExpenses(investmentId),
    enabled: !!investmentId
  });

  // Мутация для удаления расхода
  const deleteMutation = useMutation({
    mutationFn: deleteInvestmentExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-expenses', investmentId] });
      toast("Расход удален", {
        description: "Расход по инвестиции успешно удален"
      });
    },
    onError: (error: any) => {
      toast("Ошибка", {
        description: `Не удалось удалить расход: ${error.message}`
      });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
      deleteMutation.mutate(id);
    }
  };

  // Общая сумма расходов
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Ошибка при загрузке расходов: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Расходов по этой инвестиции пока нет
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Расходы по инвестиции</h3>
        <div className="text-lg font-semibold">
          Всего: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(totalExpenses)}
        </div>
      </div>
      
      <div className="space-y-3">
        {expenses.map((expense) => (
          <InvestmentExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentExpensesList;
