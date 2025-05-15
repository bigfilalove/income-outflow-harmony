
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface InvestmentFormHeaderProps {
  connectionError: string | null;
}

const InvestmentFormHeader: React.FC<InvestmentFormHeaderProps> = ({ connectionError }) => {
  return (
    <CardHeader>
      <CardTitle>Новая инвестиция</CardTitle>
      <CardDescription>Добавьте вклад собственника или инвестицию в компанию</CardDescription>
      
      {connectionError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {connectionError}
          </AlertDescription>
        </Alert>
      )}
    </CardHeader>
  );
};

export default InvestmentFormHeader;
