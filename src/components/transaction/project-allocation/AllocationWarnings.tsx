
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AllocationWarningsProps {
  remainingAmount: number;
  totalAmount: number;
  hasDuplicateProjects: boolean;
}

const AllocationWarnings: React.FC<AllocationWarningsProps> = ({
  remainingAmount,
  totalAmount,
  hasDuplicateProjects
}) => {
  return (
    <>
      {remainingAmount !== 0 && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Общая сумма распределений должна быть равна {totalAmount.toLocaleString('ru-RU')} ₽
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
