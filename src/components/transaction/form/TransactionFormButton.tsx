
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { TransactionType } from '@/types/transaction';

interface TransactionFormButtonProps {
  isSubmitting: boolean;
  isReimbursement: boolean;
  transactionType: TransactionType;
}

const TransactionFormButton: React.FC<TransactionFormButtonProps> = ({
  isSubmitting,
  isReimbursement,
  transactionType
}) => {
  return (
    <Button
      type="submit"
      className="w-full"
      variant={transactionType === 'income' ? 'default' : 'outline'}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Добавление...
        </>
      ) : isReimbursement ? (
        'Добавить возмещение'
      ) : transactionType === 'income' ? (
        'Добавить доход'
      ) : (
        'Добавить расход'
      )}
    </Button>
  );
};

export default TransactionFormButton;
