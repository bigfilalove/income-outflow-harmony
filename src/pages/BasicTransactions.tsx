
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';

const BasicTransactions = () => {
  const { currentUser } = useAuth();

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
        
        <div className="max-w-md mx-auto">
          <TransactionForm />
          <div className="mt-6 text-center text-muted-foreground">
            Ваша роль позволяет только добавлять транзакции
          </div>
        </div>
      </main>
    </div>
  );
};

export default BasicTransactions;
