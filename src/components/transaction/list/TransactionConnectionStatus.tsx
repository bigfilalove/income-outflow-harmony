
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConnectionStatusProps {
  isChecking: boolean;
  isConnected: boolean | null;
  isEmpty: boolean;
  isLoading: boolean;
}

const TransactionConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isChecking,
  isConnected,
  isEmpty,
  isLoading
}) => {
  if (isChecking) {
    return <div className="animate-pulse text-center py-2 text-muted-foreground">Проверка соединения с Supabase...</div>;
  } 
  
  if (isConnected === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка соединения</AlertTitle>
        <AlertDescription>
          Не удалось подключиться к Supabase. Проверьте настройки подключения и убедитесь, что сервис доступен.
        </AlertDescription>
      </Alert>
    );
  } 
  
  if (isConnected === true && isEmpty && !isLoading) {
    return (
      <Alert variant="default" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Подключение успешно</AlertTitle>
        <AlertDescription>
          Подключение к Supabase установлено, но транзакции не найдены. Возможно, вам нужно добавить данные.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default TransactionConnectionStatus;
