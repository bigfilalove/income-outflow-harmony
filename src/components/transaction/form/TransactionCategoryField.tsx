
import React from 'react';
import { Label } from '@/components/ui/label';
import CategorySelect from '@/components/transaction/CategorySelect';

interface TransactionCategoryFieldProps {
  category: string;
  categoryType: 'income' | 'expense' | 'reimbursement' | 'transfer' | 'investment';
  onCategoryChange: (value: string) => void;
}

const TransactionCategoryField: React.FC<TransactionCategoryFieldProps> = ({
  category,
  categoryType,
  onCategoryChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Категория</Label>
      <CategorySelect
        value={category}
        onChange={onCategoryChange}
        type={categoryType}
      />
    </div>
  );
};

export default TransactionCategoryField;
