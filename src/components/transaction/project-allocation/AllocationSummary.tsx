
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AllocationSummaryProps } from './types';

const AllocationSummary: React.FC<AllocationSummaryProps> = ({ 
  allocatedTotal, 
  remainingAmount,
  editMode
}) => {
  if (!editMode) return null;
  
  return (
    <div className="flex items-center space-x-1">
      <Badge variant={remainingAmount === 0 ? "success" : "outline"}>
        Распределено: {allocatedTotal.toLocaleString('ru-RU')} ₽
      </Badge>
      
      {remainingAmount !== 0 && (
        <Badge variant="destructive">
          Остаток: {remainingAmount.toLocaleString('ru-RU')} ₽
        </Badge>
      )}
    </div>
  );
};

export default AllocationSummary;
