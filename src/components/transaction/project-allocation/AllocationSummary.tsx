
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AllocationSummaryProps } from './types';

const AllocationSummary: React.FC<AllocationSummaryProps> = ({ 
  allocatedTotal, 
  remainingAmount,
  editMode,
  transactionType = 'expense'
}) => {
  if (!editMode) return null;
  
  const isIncome = transactionType === 'income';
  const distributionText = isIncome ? 'Распределено дохода:' : 'Распределено:';
  const remainingText = isIncome ? 'Нераспределенный доход:' : 'Остаток:';
  
  return (
    <div className="flex items-center space-x-1">
      <Badge variant={remainingAmount === 0 ? "success" : "outline"}>
        {distributionText} {allocatedTotal.toLocaleString('ru-RU')} ₽
      </Badge>
      
      {remainingAmount !== 0 && (
        <Badge variant="destructive">
          {remainingText} {remainingAmount.toLocaleString('ru-RU')} ₽
        </Badge>
      )}
    </div>
  );
};

export default AllocationSummary;
