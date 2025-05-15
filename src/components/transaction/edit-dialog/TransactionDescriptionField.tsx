
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionDescriptionFieldProps {
  description: string;
  onChange: (value: string) => void;
}

const TransactionDescriptionField: React.FC<TransactionDescriptionFieldProps> = ({ description, onChange }) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="description">Описание</Label>
      <Input
        id="description"
        placeholder="Описание транзакции"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default TransactionDescriptionField;
