
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createTransaction } from '@/services/api';
import TransactionTypeTabs from '@/components/transaction/TransactionTypeTabs';
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import ReimbursementFields from '@/components/transaction/ReimbursementFields';
import CreatorField from '@/components/transaction/CreatorField';
import CategorySelect from '@/components/transaction/CategorySelect';
import CompanySelect from '@/components/transaction/CompanySelect';
import ProjectSelect from '@/components/transaction/ProjectSelect';
import ProjectAllocations from '@/components/transaction/ProjectAllocations';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { TransactionType, ReimbursementStatus, ProjectAllocation } from '@/types/transaction';

const TransactionForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [hasAllocations, setHasAllocations] = useState(false);
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Мутация для добавления транзакции
  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast("Транзакция добавлена", {
        description: "Транзакция успешно добавлена.",
      });
      // Сброс формы
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setIsReimbursement(false);
      setReimbursedTo('');
      setCreatedBy('');
      setCompany('');
      setProject('');
      setHasAllocations(false);
      setProjectAllocations([]);
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось добавить транзакцию: ${error.message}`,
      });
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
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля",
      });
      return;
    }

    const numAmount = parseFloat(amount);

    // Проверка корректности распределения по проектам
    if (hasAllocations) {
      const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
      if (allocatedTotal !== numAmount) {
        toast("Ошибка", {
          description: "Сумма распределений должна быть равна общей сумме транзакции",
        });
        return;
      }

      // Проверка наличия дубликатов проектов
      const projectsSet = new Set(projectAllocations.map(a => a.project));
      if (projectAllocations.length !== projectsSet.size) {
        toast("Ошибка", {
          description: "Один проект используется несколько раз в распределении",
        });
        return;
      }
    }

    setIsSubmitting(true);

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
      <CardHeader>
        <CardTitle>Новая транзакция</CardTitle>
        <CardDescription>Добавьте доход или расход</CardDescription>
      </CardHeader>
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

            <div className="space-y-2">
              <Label htmlFor="amount">Сумма</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Описание транзакции"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <CategorySelect
                value={category}
                onChange={setCategory}
                type={categoryType} // Передаём тип для фильтрации
              />
            </div>

            {amount && (
              <ProjectAllocations
                totalAmount={parseFloat(amount) || 0}
                allocations={projectAllocations}
                onChange={setProjectAllocations}
                onToggleAllocations={setHasAllocations}
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

          <Button
            type="submit"
            className="w-full"
            variant={transactionType === 'income' ? 'default' : 'outline'}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : isReimbursement ? (
              'Добавить возмещение'
            ) : transactionType === 'income' ? (
              'Добавить доход'
            ) : (
              'Добавить расход'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
