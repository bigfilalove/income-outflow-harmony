
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { TransactionType } from '@/types/transaction';

interface TransactionTypeTabsProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

const TransactionTypeTabs: React.FC<TransactionTypeTabsProps> = ({ value, onChange }) => {
  return (
    <Tabs 
      defaultValue={value} 
      onValueChange={(value) => onChange(value as TransactionType)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="income">Приход</TabsTrigger>
        <TabsTrigger value="expense">Расход</TabsTrigger>
        <TabsTrigger value="reimbursement">Возмещение</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TransactionTypeTabs;
