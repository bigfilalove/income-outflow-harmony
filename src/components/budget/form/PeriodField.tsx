
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control, UseFormSetValue } from 'react-hook-form';
import { BudgetPeriod } from '@/types/budget';
import { FormValues } from './types';

interface PeriodFieldProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  currentMonth: number;
  currentQuarter: number;
}

const PeriodField: React.FC<PeriodFieldProps> = ({ 
  control, 
  setValue, 
  currentMonth, 
  currentQuarter 
}) => {
  return (
    <FormField
      control={control}
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
                setValue('month', currentMonth);
              } else if (periodValue === 'quarterly') {
                setValue('month', currentQuarter);
              } else {
                setValue('month', 1);
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
  );
};

export default PeriodField;
