
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
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import CreatorField from '@/components/transaction/CreatorField';
import CategorySelect from '@/components/transaction/CategorySelect';
import CompanySelect from '@/components/transaction/CompanySelect';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const InvestmentForm: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [investor, setInvestor] = useState(currentUser?.name || '');
  const [createdBy, setCreatedBy] = useState(currentUser?.name || '');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Prefill creator field with current user when available
  React.useEffect(() => {
    if (currentUser?.name) {
      setCreatedBy(currentUser.name);
      setInvestor(currentUser.name);
    }
  }, [currentUser]);

  // Mutation for adding investment transaction
  const mutation = useMutation({
    mutationFn: createTransactionInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast("Инвестиция добавлена", {
        description: "Инвестиция успешно добавлена."
      });
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setCompany('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !category || !company || !investor) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    
    setIsSubmitting(true);
    setConnectionError(null);

    // Примечание: поля isInvestment и investor не будут сохранены в базе,
    // но мы все равно отправляем их для поддержания совместимости с моделью Transaction
    const transaction = {
      amount: numAmount,
      description,
      category,
      date,
      type: 'income' as 'income', // Инвестиции считаются доходом
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
      // Эти поля не будут сохранены в Supabase из-за отсутствия колонок
      isInvestment: true, 
      investor: investor.trim(),
      createdAt: new Date(),
    };

    mutation.mutate(transaction);
  };

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <CardTitle>Новая инвестиция</CardTitle>
        <CardDescription>Добавьте вклад собственника или инвестицию в компанию</CardDescription>
        
        {connectionError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionError}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investor">Инвестор</Label>
              <Input
                id="investor"
                placeholder="Имя инвестора/собственника"
                value={investor}
                onChange={(e) => setInvestor(e.target.value)}
                required
              />
            </div>

            <CreatorField
              value={createdBy}
              onChange={setCreatedBy}
            />

            <div className="space-y-2">
              <Label htmlFor="company">Компания (получатель инвестиции)</Label>
              <CompanySelect
                value={company}
                onChange={setCompany}
              />
            </div>

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
                placeholder="Описание инвестиции"
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
                type="investment"
              />
            </div>

            <TransactionDatePicker
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              'Добавить инвестицию'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
