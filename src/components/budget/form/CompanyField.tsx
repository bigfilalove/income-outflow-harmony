
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { FormValues } from './types';

interface CompanyFieldProps {
  control: Control<FormValues>;
  companies: string[];
}

const CompanyField: React.FC<CompanyFieldProps> = ({ control, companies }) => {
  return (
    <FormField
      control={control}
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
              <SelectItem value="all">Все компании</SelectItem>
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
  );
};

export default CompanyField;
