
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';
import { toast } from '@/hooks/use-toast';
import { ProjectAllocation, ReimbursementStatus, TransactionType } from '@/types/transaction';

interface FormValues {
  transactionType: 'income' | 'expense';
  amount: string;
  description: string;
  category: string;
  date: Date;
  isReimbursement: boolean;
  reimbursedTo: string;
  createdBy: string;
  company: string;
  project: string;
  hasAllocations: boolean;
  projectAllocations: ProjectAllocation[];
}

interface UseTransactionFormSubmitResult {
  isSubmitting: boolean;
  connectionError: string | null;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent, values: FormValues) => Promise<void>;
}

export const useTransactionFormSubmit = (
  resetFormCallback: () => void,
  currentUserName?: string
): UseTransactionFormSubmitResult => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Mutation for adding a transaction
  const mutation = useMutation({
    mutationFn: createTransactionInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Транзакция добавлена",
        description: "Транзакция успешно добавлена."
      });
      resetFormCallback();
      setConnectionError(null);
    },
    onError: (error: any) => {
      console.error('Transaction creation error:', error);
      if (error.message && error.message.includes('Failed to fetch') || 
          error.message.includes('network') || 
          error.message.includes('connection')) {
        setConnectionError('Проблема подключения к Supabase. Пожалуйста, проверьте ваше интернет-соединение.');
      } else {
        toast({
          title: "Ошибка",
          description: `Не удалось добавить транзакцию: ${error.message}`,
          variant: "destructive"
        });
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const resetForm = () => {
    resetFormCallback();
  };

  const handleSubmit = async (e: React.FormEvent, values: FormValues) => {
    e.preventDefault();

    const { 
      transactionType, amount, description, category, date, 
      isReimbursement, reimbursedTo, createdBy, company, project,
      hasAllocations, projectAllocations
    } = values;

    if (!amount || !description || !category) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    const numAmount = parseFloat(amount);

    // Check allocation validity
    if (hasAllocations) {
      const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
      if (allocatedTotal !== numAmount) {
        toast({
          title: "Ошибка",
          description: "Сумма распределений должна быть равна общей сумме транзакции"
        });
        return;
      }

      // Check for duplicate projects
      const projectsSet = new Set(projectAllocations.map(a => a.project));
      if (projectAllocations.length !== projectsSet.size) {
        toast({
          title: "Ошибка",
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
      type: transactionType,
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
      project: hasAllocations ? undefined : (project || undefined),
      isReimbursement: transactionType === 'expense' && isReimbursement ? true : false,
      reimbursedTo: transactionType === 'expense' && isReimbursement ? reimbursedTo : undefined,
      reimbursementStatus: transactionType === 'expense' && isReimbursement ? 'pending' as ReimbursementStatus : undefined,
      createdAt: new Date(),
      projectAllocations: hasAllocations ? projectAllocations : undefined,
      hasAllocations
    };

    mutation.mutate(transaction);
  };

  return {
    isSubmitting,
    connectionError,
    resetForm,
    handleSubmit
  };
};
