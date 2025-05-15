
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AllocationWarningsProps } from './types';

const AllocationWarnings: React.FC<AllocationWarningsProps> = ({
  remainingAmount,
  totalAmount,
  hasDuplicateProjects,
  transactionType = 'expense'
}) => {
  const isIncome = transactionType === 'income';
  const allocationMessage = isIncome 
    ? `Общая сумма распределения дохода должна быть равна ${totalAmount.toLocaleString('ru-RU')} ₽`
    : `Общая сумма распределений должна быть равна ${totalAmount.toLocaleString('ru-RU')} ₽`;

  return (
    <>
      {remainingAmount !== 0 && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {allocationMessage}
          </AlertDescription>
        </Alert>
      )}

      {hasDuplicateProjects && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Один проект используется несколько раз
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AllocationWarnings;
