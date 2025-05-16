
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';
import { toast } from 'sonner';
import { ProjectAllocation } from '@/types/transaction';
import { InvestmentFormValues } from './types';

export const useInvestmentFormSubmit = (resetForm: () => void, currentUserName?: string) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Mutation for adding investment transaction
  const mutation = useMutation({
    mutationFn: createTransactionInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast("Инвестиция добавлена", {
        description: "Инвестиция успешно добавлена."
      });
      // Reset form
      resetForm();
      setConnectionError(null);
    },
    onError: (error: any) => {
      console.error('Investment creation error:', error);
      if (error.message && error.message.includes('Failed to fetch') || 
          error.message.includes('network') || 
          error.message.includes('connection')) {
        setConnectionError('Проблема подключения к Supabase. Пожалуйста, проверьте ваше интернет-соединение.');
      } else {
        toast("Ошибка", {
          description: `Не удалось добавить инвестицию: ${error.message}`
        });
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent, formValues: InvestmentFormValues) => {
    e.preventDefault();

    const { 
      amount, 
      description, 
      category, 
      date, 
      investor, 
      createdBy, 
      company, 
      hasAllocations, 
      projectAllocations 
    } = formValues;

    if (!amount || !description || !category || !company || !investor) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    
    // Validate allocations if enabled
    if (hasAllocations) {
      const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
      if (allocatedTotal !== numAmount) {
        toast("Ошибка", {
          description: "Сумма распределений должна быть равна общей сумме инвестиции"
        });
        return;
      }

      // Check for duplicate projects
      const projectsSet = new Set(projectAllocations.map(a => a.project));
      if (projectAllocations.length !== projectsSet.size) {
        toast("Ошибка", {
          description: "Один проект используется несколько раз в распределении"
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    setConnectionError(null);

    const transaction = {
      amount: numAmount,
      description,
      category,
      date,
      type: 'income' as 'income', // Инвестиции считаются доходом
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
      isInvestment: true, // Явно устанавливаем флаг инвестиции
      investor: investor.trim(),
      createdAt: new Date(),
      hasAllocations,
      projectAllocations: hasAllocations ? projectAllocations : undefined,
    };

    mutation.mutate(transaction);
  };

  return {
    isSubmitting,
    connectionError,
    handleSubmit
  };
};
