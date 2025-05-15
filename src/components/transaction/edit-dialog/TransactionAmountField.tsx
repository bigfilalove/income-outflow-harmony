
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionAmountFieldProps {
  amount: string;
  onChange: (value: string) => void;
}

const TransactionAmountField: React.FC<TransactionAmountFieldProps> = ({ amount, onChange }) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="amount">Сумма</Label>
      <Input
        id="amount"
        type="number"
        placeholder="10000"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default TransactionAmountField;
