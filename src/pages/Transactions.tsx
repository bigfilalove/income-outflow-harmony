
import React from 'react';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import { useAuth } from '@/context/AuthContext';

const Transactions = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Транзакции</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
              {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'})
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ReportDownloadDialog reportType="transactions" />
          <ReportDownloadDialog reportType="reimbursements" />
          <ReportDownloadDialog reportType="period" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TransactionList />
          </div>
          <div>
            <TransactionForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
