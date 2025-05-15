
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { InvestmentExpense } from "@/types/investment";
import CategorySelect from "@/components/transaction/CategorySelect";
import ProjectSelect from "@/components/transaction/ProjectSelect";
import TransactionDatePicker from "@/components/transaction/TransactionDatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addInvestmentExpense } from "@/services/api/supabase/investments/investment-expenses";
import { toast } from "sonner";

interface InvestmentExpenseFormProps {
  investmentId: string;
  onSuccess?: () => void;
}

const InvestmentExpenseForm: React.FC<InvestmentExpenseFormProps> = ({ 
  investmentId,
  onSuccess 
}) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Предустановка creator
  const createdBy = currentUser?.name || '';

  // Мутация для добавления расхода
  const mutation = useMutation({
    mutationFn: addInvestmentExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-expenses', investmentId] });
      toast("Расход добавлен", {
        description: "Расход по инвестиции успешно добавлен"
      });
      resetForm();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast("Ошибка", {
        description: `Не удалось добавить расход: ${error.message}`
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setProject('');
    setDate(new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast("Ошибка", {
        description: "Пожалуйста, введите корректную сумму"
      });
      return;
    }

    setIsSubmitting(true);

    const expense: Omit<InvestmentExpense, 'id' | 'created_at'> = {
      investment_id: investmentId,
      amount: numAmount,
      description,
      category,
      date,
      project: project || undefined,
      created_by: createdBy
    };

    mutation.mutate(expense);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить расход по инвестиции</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма расхода</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Сумма"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              placeholder="Описание расхода"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <CategorySelect
              value={category}
              onChange={setCategory}
              type="expense"
            />
          </div>

          <div className="space-y-2">
            <ProjectSelect
              value={project}
              onChange={setProject}
              label="Проект (необязательно)"
              required={false}
            />
          </div>

          <TransactionDatePicker
            date={date}
            onDateChange={(newDate) => newDate && setDate(newDate)}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Добавление..." : "Добавить расход"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentExpenseForm;
