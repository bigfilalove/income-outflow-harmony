import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Добавляем Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { useBudgets } from '@/context/BudgetContext';
import { getCompanies } from '@/types/transaction';
import { getMonthsList, getQuartersList, getYearsList } from '@/lib/date-utils';
import { BudgetPeriod } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form'; // Добавляем FormItem и FormLabel
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Импортируем новые компоненты
import FormTabs from './form/FormTabs';
import CompanyField from './form/CompanyField';
import AmountField from './form/AmountField';
import PeriodField from './form/PeriodField';
import YearField from './form/YearField';
import MonthField from './form/MonthField';
import CategorySelect from '../transaction/CategorySelect';
import { BudgetFormProps, FormValues, formSchema } from './form/types';

// Создаем QueryClient
const queryClient = new QueryClient();

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSuccess, 
  initialData,
  defaultType = 'expense'
}) => {
  const { addBudget, updateBudget } = useBudgets();
  const [companies] = useState(getCompanies().filter(company => company !== ''));
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
      company: initialData.company || "all",
    } : {
      category: '',
      amount: 0,
      period: 'monthly' as BudgetPeriod,
      year: currentYear,
      month: currentMonth,
      type: defaultType,
      company: "all",
    },
  });
  
  // Следим за изменением типа бюджета
  const selectedType = form.watch('type');
  const selectedPeriod = form.watch('period');
  
  // Обработчик отправки формы
  const onSubmit = async (values: FormValues) => {
    try {
      const companyValue = values.company === "all" ? null : values.company;
      
      if (initialData) {
        await updateBudget(initialData.id, {
          ...values,
          company: companyValue
        });
      } else {
        await addBudget({
          category: values.category,
          amount: values.amount,
          period: values.period,
          year: values.year,
          month: values.month,
          type: values.type,
          company: companyValue,
          createdAt: new Date(),
          createdBy: null,
        });
      }
      
      if (!initialData) {
        form.reset({
          category: '',
          amount: 0,
          period: values.period,
          year: values.year,
          month: values.month,
          type: values.type,
          company: "all",
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
    <QueryClientProvider client={queryClient}>
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Редактировать бюджет' : 'Добавить бюджет'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTabs 
                selectedType={selectedType}
                onValueChange={(value) => form.setValue('type', value)}
              />
              
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      type={selectedType}
                    />
                  </FormItem>
                )}
              />
              
              <CompanyField 
                control={form.control}
                companies={companies}
              />
              
              <AmountField control={form.control} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PeriodField 
                  control={form.control}
                  setValue={form.setValue}
                  currentMonth={currentMonth}
                  currentQuarter={currentQuarter}
                />
                
                <YearField 
                  control={form.control}
                  years={years}
                />
                
                <MonthField 
                  control={form.control}
                  selectedPeriod={selectedPeriod}
                  months={months}
                  quarters={quarters}
                />
              </div>
              
              <Button type="submit" className="w-full">
                {initialData ? 'Обновить бюджет' : 'Добавить бюджет'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </QueryClientProvider>
  );
};

export default BudgetForm;