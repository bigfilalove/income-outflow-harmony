
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { useTransactions } from '@/context/transaction';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BasicTransactions = () => {
  const { currentUser } = useAuth();
  const { transactions, error, isLoading } = useTransactions();
  const [offlineMode, setOfflineMode] = useState(false);

  // Check if we're in offline mode based on error
  React.useEffect(() => {
    if (error && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('network') || 
         error.message.includes('connection') ||
         error.message.includes('Supabase'))) {
      setOfflineMode(true);
    } else {
      setOfflineMode(false);
    }
  }, [error]);

  // Filter only reimbursements for the current user, if any
  const myReimbursements = transactions.filter(t => 
    t.isReimbursement && 
    t.reimbursedTo === currentUser?.name
  );

  const renderConnectionError = () => {
    if (offlineMode) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Проблема с соединением</AlertTitle>
          <AlertDescription>
            Не удалось подключиться к базе данных Supabase. Вы можете продолжить работу в автономном режиме, но данные не будут сохранены до восстановления соединения.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Добавление транзакций</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
              {currentUser.name} (Базовый пользователь)
            </div>
          )}
        </div>
        
        {renderConnectionError()}
        
        <div className="max-w-md mx-auto space-y-6">
          <TransactionForm />
          
          {myReimbursements.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Мои возмещения</h3>
                <div className="space-y-4">
                  {myReimbursements.map(reimbursement => (
                    <ReimbursementItem key={reimbursement.id} reimbursement={reimbursement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="text-center text-muted-foreground">
            Ваша роль позволяет только добавлять транзакции и отслеживать свои возмещения
          </div>
        </div>
      </main>
    </div>
  );
};

interface ReimbursementItemProps {
  reimbursement: Transaction;
}

const ReimbursementItem: React.FC<ReimbursementItemProps> = ({ reimbursement }) => {
  return (
    <div className="p-3 rounded-lg border">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-amber-100 text-amber-700">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">{reimbursement.description}</div>
          <div className="text-xs text-muted-foreground">
            {reimbursement.category} • {formatDateShort(reimbursement.date)}
          </div>
          <div className="flex justify-between items-center mt-1">
            <Badge variant={reimbursement.reimbursementStatus === 'pending' ? 'outline' : 'default'}>
              {reimbursement.reimbursementStatus === 'pending' ? 'Ожидает возмещения' : 'Возмещено'}
            </Badge>
            <span className="font-medium text-expense">
              {formatCurrency(reimbursement.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicTransactions;
