
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CategorySelect from '@/components/transaction/CategorySelect';
import ProjectSelect from '@/components/transaction/ProjectSelect';
import { getTransactionCategories } from '@/types/transaction';
import { InvestmentExpense } from '@/types/investment';
import { useQueryClient } from '@tanstack/react-query';
import { addInvestmentExpense, updateInvestmentExpense } from '@/services/api/supabase/investments/investment-expenses';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';

interface InvestmentExpenseFormProps {
  investmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
  expense?: InvestmentExpense; // For editing existing expense
  isEditing?: boolean;
}

const InvestmentExpenseForm: React.FC<InvestmentExpenseFormProps> = ({
  investmentId,
  onSuccess,
  onCancel,
  isOpen,
  expense,
  isEditing = false
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [description, setDescription] = useState(expense?.description || '');
  const [category, setCategory] = useState(expense?.category || '');
  const [date, setDate] = useState<Date>(expense?.date || new Date());
  const [project, setProject] = useState(expense?.project || '');
  const [createdBy, setCreatedBy] = useState(expense?.created_by || '');

  // Get expense categories
  const categories = getTransactionCategories().expense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        investment_id: investmentId,
        amount: parseFloat(amount),
        description,
        category,
        date,
        project: project || undefined,
        created_by: createdBy || undefined
      };

      if (isEditing && expense) {
        // Update existing expense
        await updateInvestmentExpense({
          ...expenseData,
          id: expense.id,
          created_at: expense.created_at
        });
        toast.success('Расход успешно обновлен');
      } else {
        // Add new expense
        await addInvestmentExpense(expenseData);
        toast.success('Расход успешно добавлен');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['investment-expenses', investmentId] });
      
      // Reset form and close dialog
      onSuccess();
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать расход' : 'Добавить расход к инвестиции'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание расхода"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <CategorySelect
              type="expense"
              value={category}
              onChange={setCategory}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Дата</Label>
            <DatePicker
              date={date}
              onSelect={setDate}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project">Проект (необязательно)</Label>
            <ProjectSelect
              value={project}
              onChange={setProject}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="createdBy">Создатель (необязательно)</Label>
            <Input
              id="createdBy"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Кто создал расход"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentExpenseForm;
