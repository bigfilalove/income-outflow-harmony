
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBudgets } from '@/context/BudgetContext';
import { getTransactionCategories } from '@/types/transaction';
import { getCompanies } from '@/types/transaction';
import { getMonthsList, getQuartersList, getYearsList } from '@/lib/date-utils';
import { Budget, BudgetPeriod } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  category: z.string({ required_error: 'Выберите категорию' }),
  amount: z.coerce.number({ required_error: 'Введите сумму' }).positive('Сумма должна быть положительной'),
  period: z.enum(['monthly', 'quarterly', 'annual'], { required_error: 'Выберите период' }),
  year: z.coerce.number({ required_error: 'Выберите год' }),
  month: z.coerce.number({ required_error: 'Выберите месяц/квартал' }),
  type: z.enum(['expense', 'income'], { required_error: 'Выберите тип' }),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onSuccess?: () => void;
  initialData?: Budget;
  defaultType?: 'expense' | 'income';
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSuccess, 
  initialData,
  defaultType = 'expense'
}) => {
  const { addBudget, updateBudget } = useBudgets();
  const [categories, setCategories] = useState(getTransactionCategories());
  const [companies] = useState(getCompanies());
  const years = getYearsList();
  const months = getMonthsList();
  const quarters = getQuartersList();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      category: initialData.category,
      amount: initialData.amount,
      period: initialData.period,
      year: initialData.year,
      month: initialData.month,
      type: initialData.type,
      company: initialData.company || undefined,
    } : {
      category: '',
      amount: 0,
      period: 'monthly' as BudgetPeriod,
      year: currentYear,
      month: currentMonth,
      type: defaultType,
      company: '',
    },
  });
  
  // Получение списка категорий
  useEffect(() => {
    const handleCategoriesUpdate = () => {
      setCategories(getTransactionCategories());
    };
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);
  
  // Следим за изменением типа бюджета для обновления списка категорий
  const selectedType = form.watch('type');
  const selectedPeriod = form.watch('period');
  
  // Обработчик отправки формы
  const onSubmit = async (values: FormValues) => {
    try {
      if (initialData) {
        await updateBudget(initialData.id, values);
      } else {
        await addBudget({
          ...values,
          createdAt: new Date(),
          createdBy: null,
        });
      }
      
      // Сбрасываем форму и вызываем коллбэк успеха
      if (!initialData) {
        form.reset({
          category: '',
          amount: 0,
          period: values.period,
          year: values.year,
          month: values.month,
          type: values.type,
          company: values.company,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Редактировать бюджет' : 'Добавить бюджет'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue={selectedType} onValueChange={(value) => form.setValue('type', value as 'expense' | 'income')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">Расходы</TabsTrigger>
                <TabsTrigger value="income">Доходы</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories[selectedType].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компания (необязательно)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите компанию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Все компании</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Если не указано, бюджет будет применен ко всем компаниям
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="Введите сумму" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Период</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Сбрасываем месяц/квартал при смене периода
                        const periodValue = value as BudgetPeriod;
                        if (periodValue === 'monthly') {
                          form.setValue('month', currentMonth);
                        } else if (periodValue === 'quarterly') {
                          form.setValue('month', currentQuarter);
                        } else {
                          form.setValue('month', 1);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите период" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                        <SelectItem value="quarterly">Ежеквартально</SelectItem>
                        <SelectItem value="annual">Ежегодно</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите год" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.value} value={year.value.toString()}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedPeriod === 'monthly' && 'Месяц'}
                      {selectedPeriod === 'quarterly' && 'Квартал'}
                      {selectedPeriod === 'annual' && 'Год'}
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            selectedPeriod === 'monthly' ? 'Выберите месяц' :
                            selectedPeriod === 'quarterly' ? 'Выберите квартал' : 'Год'
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedPeriod === 'monthly' && months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                        {selectedPeriod === 'quarterly' && quarters.map((quarter) => (
                          <SelectItem key={quarter.value} value={quarter.value.toString()}>
                            {quarter.label}
                          </SelectItem>
                        ))}
                        {selectedPeriod === 'annual' && (
                          <SelectItem value="1">Весь год</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full">
              {initialData ? 'Обновить бюджет' : 'Добавить бюджет'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
