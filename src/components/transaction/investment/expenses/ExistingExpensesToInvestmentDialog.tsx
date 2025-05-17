
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Transaction } from '@/types/transaction';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';
import { addInvestmentExpense } from '@/services/api/supabase/investments';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ExistingExpensesToInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string;
  onSuccess: () => void;
}

const ExistingExpensesToInvestmentDialog: React.FC<ExistingExpensesToInvestmentDialogProps> = ({
  isOpen,
  onClose,
  investmentId,
  onSuccess
}) => {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all expense transactions
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ['transactions-for-investment'],
    queryFn: async () => {
      const transactions = await fetchTransactionsFromSupabase();
      // Filter only expense transactions
      return transactions.filter(t => t.type === 'expense');
    },
    enabled: isOpen
  });

  // Filter expenses based on search term
  const filteredExpenses = allTransactions.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expense.company && expense.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleExpense = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId) 
        : [...prev, expenseId]
    );
  };

  const handleAddToInvestment = async () => {
    if (selectedExpenses.length === 0) {
      toast.error('Выберите хотя бы один расход');
      return;
    }

    setIsSubmitting(true);

    try {
      // Process each selected expense
      const promises = selectedExpenses.map(expenseId => {
        const expense = allTransactions.find(t => t.id === expenseId);
        if (!expense) return null;

        return addInvestmentExpense({
          investment_id: investmentId,
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          date: expense.date,
          project: expense.project || undefined,
          created_by: expense.createdBy || undefined
        });
      });

      // Wait for all expenses to be added
      await Promise.all(promises.filter(Boolean));
      
      toast.success(`${selectedExpenses.length} расход(ов) добавлено к инвестиции`);
      setSelectedExpenses([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(`Ошибка при добавлении расходов: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Добавить существующие расходы к инвестиции</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск расходов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Загрузка расходов...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Расходы не найдены</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`expense-${expense.id}`}
                    checked={selectedExpenses.includes(expense.id)}
                    onCheckedChange={() => handleToggleExpense(expense.id)}
                    className="mr-3 mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`expense-${expense.id}`}
                      className="flex justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {expense.category}
                          {expense.company && ` · ${expense.company}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(expense.date)}
                        </div>
                      </div>
                      <div className="font-semibold text-destructive">
                        {formatCurrency(expense.amount)}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm">
            Выбрано: {selectedExpenses.length} расходов
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button 
              onClick={handleAddToInvestment} 
              disabled={selectedExpenses.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Добавление...' : 'Добавить выбранные'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingExpensesToInvestmentDialog;
