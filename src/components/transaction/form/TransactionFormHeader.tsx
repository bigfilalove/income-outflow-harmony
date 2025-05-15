
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TransactionFormHeaderProps {
  connectionError: string | null;
}

const TransactionFormHeader: React.FC<TransactionFormHeaderProps> = ({ 
  connectionError 
}) => {
  return (
    <CardHeader>
      <CardTitle>Новая транзакция</CardTitle>
      <CardDescription>Добавьте доход или расход</CardDescription>
      
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

export default TransactionFormHeader;
