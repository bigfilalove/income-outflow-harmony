
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { BudgetPeriod } from '@/types/budget';
import { FormValues } from './types';

interface MonthFieldProps {
  control: Control<FormValues>;
  selectedPeriod: BudgetPeriod;
  months: Array<{ value: number; label: string }>;
  quarters: Array<{ value: number; label: string }>;
}

const MonthField: React.FC<MonthFieldProps> = ({ 
  control, 
  selectedPeriod, 
  months, 
  quarters 
}) => {
  return (
    <FormField
      control={control}
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
  );
};

export default MonthField;
