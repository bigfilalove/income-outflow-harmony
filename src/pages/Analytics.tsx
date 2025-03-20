
import React from 'react';
import Navbar from '@/components/Navbar';
import FinanceSummary from '@/components/FinanceSummary';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import FinancialOverview from '@/components/analytics/FinancialOverview';
import TopCategories from '@/components/analytics/TopCategories';
import { useAnalytics } from '@/hooks/use-analytics';

const Analytics = () => {
  const {
    totalIncome,
    totalExpense,
    balance,
    efficiency,
    topIncomeCategories,
    topExpenseCategories
  } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
          <ReportDownloadDialog reportType="analytics" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <FinancialOverview 
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            efficiency={efficiency}
          />
          
          <TopCategories 
            topIncomeCategories={topIncomeCategories}
            topExpenseCategories={topExpenseCategories}
          />
        </div>
        
        <FinanceSummary />
      </main>
    </div>
  );
};

export default Analytics;
