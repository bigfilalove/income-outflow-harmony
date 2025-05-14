
import React from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ConnectionStatusProps = {
  status: 'checking' | 'connected' | 'error';
  errorMessage: string | null;
};

export const ConnectionStatus = ({ status, errorMessage }: ConnectionStatusProps) => {
  if (status === 'checking') {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Проверка соединения с Supabase...</span>
      </div>
    );
  } else if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Примечание</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  } else {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span>Подключение к Supabase установлено</span>
      </div>
    );
  }
};
