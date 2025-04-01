
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionType } from '@/types/transaction';

interface TransactionTypeTabsProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  showTransfer?: boolean;
}

const TransactionTypeTabs: React.FC<TransactionTypeTabsProps> = ({ 
  value, 
  onChange,
  showTransfer = true
}) => {
  return (
    <Tabs value={value} onValueChange={(newValue) => onChange(newValue as TransactionType)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="income">Доход</TabsTrigger>
        <TabsTrigger value="expense">Расход</TabsTrigger>
        {showTransfer && <TabsTrigger value="transfer">Перевод</TabsTrigger>}
      </TabsList>
    </Tabs>
  );
};

export default TransactionTypeTabs;
