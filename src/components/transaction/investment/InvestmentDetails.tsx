
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InvestmentDetailsProps {
  amount: string;
  description: string;
  investor: string;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onInvestorChange: (value: string) => void;
}

const InvestmentDetails: React.FC<InvestmentDetailsProps> = ({
  amount,
  description,
  investor,
  onAmountChange,
  onDescriptionChange,
  onInvestorChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="investor">Инвестор</Label>
        <Input
          id="investor"
          placeholder="Имя инвестора/собственника"
          value={investor}
          onChange={(e) => onInvestorChange(e.target.value)}
          required
        />
      </div>

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
          placeholder="Описание инвестиции"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default InvestmentDetails;
