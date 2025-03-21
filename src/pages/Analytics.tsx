
import React from 'react';
import Navbar from '@/components/Navbar';
import FinanceSummary from '@/components/FinanceSummary';
import FinancialOverview from '@/components/analytics/FinancialOverview';
import TopCategories from '@/components/analytics/TopCategories';
import CompanyAnalytics from '@/components/analytics/CompanyAnalytics';
import PredictionCard from '@/components/predictions/PredictionCard';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactions } from '@/context/TransactionContext';

const Analytics = () => {
  const { currentUser } = useAuth();
  const { isLoading } = useTransactions();
  const analytics = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
              {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'})
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <FinancialOverview 
              totalIncome={analytics.totalIncome}
              totalExpense={analytics.totalExpense}
              balance={analytics.balance}
              efficiency={analytics.efficiency}
            />
            <PredictionCard />
          </div>
        )}
        
        <FinanceSummary />
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <TopCategories 
              topIncomeCategories={analytics.topIncomeCategories}
              topExpenseCategories={analytics.topExpenseCategories}
            />
            <CompanyAnalytics 
              companyTotals={analytics.companyTotals}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
