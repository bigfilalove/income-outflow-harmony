
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionDetailsProps {
  amount: string;
  description: string;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  amount,
  description,
  onAmountChange,
  onDescriptionChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount">Сумма</Label>
        <Input
          id="amount"
          type="number"
          placeholder="10000"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Input
          id="description"
          placeholder="Описание транзакции"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default TransactionDetails;
