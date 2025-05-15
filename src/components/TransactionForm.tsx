
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';
import { TransactionType, ReimbursementStatus, ProjectAllocation } from '@/types/transaction';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';

// Import our components
import TransactionFormHeader from '@/components/transaction/form/TransactionFormHeader';
import TransactionFormButton from '@/components/transaction/form/TransactionFormButton';
import TransactionDetails from '@/components/transaction/form/TransactionDetails';
import TransactionCategoryField from '@/components/transaction/form/TransactionCategoryField';

// Import existing components
import TransactionTypeTabs from '@/components/transaction/TransactionTypeTabs';
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import ReimbursementFields from '@/components/transaction/ReimbursementFields';
import CreatorField from '@/components/transaction/CreatorField';
import CompanySelect from '@/components/transaction/CompanySelect';
import ProjectSelect from '@/components/transaction/ProjectSelect';
import ProjectAllocations from '@/components/transaction/ProjectAllocations';

const TransactionForm: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState(currentUser?.name || '');
  const [createdBy, setCreatedBy] = useState(currentUser?.name || '');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [hasAllocations, setHasAllocations] = useState(false);
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Prefill creator and reimbursement fields with current user when available
  useEffect(() => {
    if (currentUser?.name) {
      setCreatedBy(currentUser.name);
      setReimbursedTo(currentUser.name);
    }
  }, [currentUser]);

  // Мутация для добавления транзакции
  const mutation = useMutation({
    mutationFn: createTransactionInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Транзакция добавлена",
        description: "Транзакция успешно добавлена."
      });
      // Сброс формы
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setIsReimbursement(false);
      setReimbursedTo(currentUser?.name || '');
      setCompany('');
      setProject('');
      setHasAllocations(false);
      setProjectAllocations([]);
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

  const handleTransactionTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setIsReimbursement(false); // Сбрасываем возмещение при смене типа
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !category) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    const numAmount = parseFloat(amount);

    // Проверка корректности распределения по проектам
    if (hasAllocations) {
      const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
      if (allocatedTotal !== numAmount) {
        toast({
          title: "Ошибка",
          description: "Сумма распределений должна быть равна общей сумме транзакции"
        });
        return;
      }

      // Проверка наличия дубликатов проектов
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

  // Определяем тип для CategorySelect
  const categoryType = isReimbursement ? 'reimbursement' : transactionType;

  return (
    <Card className="animate-slideUp">
      <TransactionFormHeader connectionError={connectionError} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransactionTypeTabs
            value={transactionType}
            onChange={handleTransactionTypeChange}
          />

          <div className="space-y-4">
            <CreatorField
              value={createdBy}
              onChange={setCreatedBy}
            />

            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <CompanySelect
                value={company}
                onChange={setCompany}
              />
            </div>

            {!hasAllocations && (
              <ProjectSelect
                value={project}
                onChange={setProject}
              />
            )}

            <TransactionDetails
              amount={amount}
              description={description}
              onAmountChange={setAmount}
              onDescriptionChange={setDescription}
            />

            <TransactionCategoryField
              category={category}
              categoryType={categoryType}
              onCategoryChange={setCategory}
            />

            {amount && (
              <ProjectAllocations
                totalAmount={parseFloat(amount) || 0}
                allocations={projectAllocations}
                onChange={setProjectAllocations}
                onToggleAllocations={setHasAllocations}
                transactionType={transactionType}
              />
            )}

            {transactionType === 'expense' && (
              <ReimbursementFields
                isReimbursement={isReimbursement}
                onReimbursementChange={setIsReimbursement}
                reimbursedTo={reimbursedTo}
                onReimbursedToChange={setReimbursedTo}
              />
            )}

            <TransactionDatePicker
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>

          <TransactionFormButton
            isSubmitting={isSubmitting}
            isReimbursement={isReimbursement}
            transactionType={transactionType}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
