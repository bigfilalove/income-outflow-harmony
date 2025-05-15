
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AllocationActionsProps } from './types';

const AllocationActions: React.FC<AllocationActionsProps> = ({
  remainingAmount,
  allocations,
  projects,
  onChange,
  addAllocation,
  transactionType = 'expense'
}) => {
  const isIncome = transactionType === 'income';
  const buttonText = isIncome ? "Добавить оставшийся доход к последнему проекту" : "Добавить остаток к последнему проекту";
  
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={addAllocation}
        disabled={projects.length <= allocations.length}
      >
        <Plus className="h-4 w-4 mr-1" />
        Добавить проект
      </Button>
      
      {remainingAmount > 0 && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full mt-4"
          onClick={() => {
            if (allocations.length > 0) {
              const newAllocations = [...allocations];
              const lastIndex = newAllocations.length - 1;
              newAllocations[lastIndex].amount += remainingAmount;
              onChange(newAllocations);
            }
          }}
        >
          {buttonText}
        </Button>
      )}
    </>
  );
};

export default AllocationActions;
