
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBudgets } from '@/context/BudgetContext';
import { getTransactionCategories, CategoryList } from '@/types/transaction';
import { getCompanies } from '@/types/transaction';
import { getMonthsList, getQuartersList, getYearsList } from '@/lib/date-utils';
import { BudgetPeriod } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

// Import our new form components
import FormTabs from './form/FormTabs';
import CategoryField from './form/CategoryField';
import CompanyField from './form/CompanyField';
import AmountField from './form/AmountField';
import PeriodField from './form/PeriodField';
import YearField from './form/YearField';
import MonthField from './form/MonthField';
import { BudgetFormProps, FormValues, formSchema } from './form/types';

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSuccess, 
  initialData,
  defaultType = 'expense'
}) => {
  const { addBudget, updateBudget } = useBudgets();
  const [categories, setCategories] = useState<CategoryList>(getTransactionCategories());
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
        // Fix: Ensure all required properties are included
        await addBudget({
          category: values.category,
          amount: values.amount,
          period: values.period,
          year: values.year,
          month: values.month,
          type: values.type,
          company: values.company || null,
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
            <FormTabs 
              selectedType={selectedType}
              onValueChange={(value) => form.setValue('type', value)}
            />
            
            <CategoryField 
              control={form.control}
              categories={categories}
              selectedType={selectedType}
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
  );
};

export default BudgetForm;
