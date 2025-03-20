
import React from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        
        <Dashboard />
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className={isMobile ? "order-2" : ""}>
            <TransactionForm />
          </div>
          <div className={isMobile ? "order-1" : ""}>
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
