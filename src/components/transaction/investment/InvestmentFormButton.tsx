
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InvestmentFormButtonProps {
  isSubmitting: boolean;
}

const InvestmentFormButton: React.FC<InvestmentFormButtonProps> = ({ isSubmitting }) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Добавление...
        </>
      ) : (
        'Добавить инвестицию'
      )}
    </Button>
  );
};

export default InvestmentFormButton;
