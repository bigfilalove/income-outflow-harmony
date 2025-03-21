
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { FormValues } from './types';

interface AmountFieldProps {
  control: Control<FormValues>;
}

const AmountField: React.FC<AmountFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default AmountField;
