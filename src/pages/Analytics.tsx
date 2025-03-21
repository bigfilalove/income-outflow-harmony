
import React from 'react';
import Navbar from '@/components/Navbar';
import FinancialOverview from '@/components/analytics/FinancialOverview';
import TopCategories from '@/components/analytics/TopCategories';
import CompanyAnalytics from '@/components/analytics/CompanyAnalytics';
import ProjectAnalytics from '@/components/analytics/ProjectAnalytics';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
          <div className="flex gap-2">
            <ReportDownloadDialog reportType="analytics" />
          </div>
        </div>
        
        <FinancialOverview />
        
        <div className="grid gap-6 md:grid-cols-2">
          <TopCategories />
          <CompanyAnalytics />
        </div>
        
        <ProjectAnalytics />
      </main>
    </div>
  );
};

export default Analytics;
