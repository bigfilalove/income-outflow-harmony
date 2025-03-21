
import React from 'react';
import Navbar from '@/components/Navbar';
import FinancialOverview from '@/components/analytics/FinancialOverview';
import TopCategories from '@/components/analytics/TopCategories';
import CompanyAnalytics from '@/components/analytics/CompanyAnalytics';
import ProjectAnalytics from '@/components/analytics/ProjectAnalytics';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { ChartPie, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const {
    totalIncome,
    totalExpense,
    balance,
    efficiency,
    topIncomeCategories,
    topExpenseCategories,
    companyTotals,
    projectTotals
  } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
          <div className="flex gap-2">
            <ReportDownloadDialog reportType="analytics" />
            <Link to="/advanced-analytics">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Продвинутая аналитика</span>
              </Button>
            </Link>
          </div>
        </div>
        
        <FinancialOverview 
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          efficiency={efficiency}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <TopCategories 
            topIncomeCategories={topIncomeCategories}
            topExpenseCategories={topExpenseCategories}
          />
          <CompanyAnalytics companyTotals={companyTotals} />
        </div>
        
        <ProjectAnalytics projectTotals={projectTotals} />
      </main>
    </div>
  );
};

export default Analytics;
