
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { FormValues } from './types';

interface YearFieldProps {
  control: Control<FormValues>;
  years: Array<{ value: number; label: string }>;
}

const YearField: React.FC<YearFieldProps> = ({ control, years }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default YearField;
