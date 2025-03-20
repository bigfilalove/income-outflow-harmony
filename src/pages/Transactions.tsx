
import React from 'react';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';

const Transactions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Транзакции</h1>
        
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
