
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormTabsProps {
  selectedType: 'expense' | 'income';
  onValueChange: (value: 'expense' | 'income') => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ selectedType, onValueChange }) => {
  return (
    <Tabs 
      defaultValue={selectedType} 
      onValueChange={(value) => onValueChange(value as 'expense' | 'income')}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="expense">Расходы</TabsTrigger>
        <TabsTrigger value="income">Доходы</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FormTabs;
