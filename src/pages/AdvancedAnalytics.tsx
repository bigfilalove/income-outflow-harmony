
import React from 'react';
import Navbar from '@/components/Navbar';
import { useTransactions } from '@/context/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KpiDashboard from '@/components/analytics/KpiDashboard';
import { useAnalytics } from '@/hooks/use-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateKpis } from '@/utils/kpiUtils';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import { PredictionData } from '@/services/api/predictions';
import { usePredictions } from '@/hooks/use-predictions';

const AdvancedAnalytics = () => {
  const { totalIncome, totalExpense, balance, companyTotals, projectTotals } = useAnalytics();
  const { transactions } = useTransactions();
  const { predictionData } = usePredictions();
  
  // Calculate KPIs
  const kpis = calculateKpis(transactions, predictionData);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Продвинутая аналитика</h1>
          <div className="flex gap-2">
            <ReportDownloadDialog reportType="kpi" />
          </div>
        </div>
        
        <div className="grid gap-6">
          <Tabs defaultValue="profitability">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="profitability">Рентабельность</TabsTrigger>
              <TabsTrigger value="liquidity">Ликвидность</TabsTrigger>
              <TabsTrigger value="turnover">Оборачиваемость</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profitability">
              <KpiDashboard 
                title="Показатели рентабельности" 
                kpis={kpis.profitability}
                chartData={kpis.profitabilityTrend}
              />
            </TabsContent>
            
            <TabsContent value="liquidity">
              <KpiDashboard 
                title="Показатели ликвидности" 
                kpis={kpis.liquidity}
                chartData={kpis.liquidityTrend}
              />
            </TabsContent>
            
            <TabsContent value="turnover">
              <KpiDashboard 
                title="Показатели оборачиваемости" 
                kpis={kpis.turnover}
                chartData={kpis.turnoverTrend}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Настраиваемый дашборд</CardTitle>
            <CardDescription>Перетащите и расположите виджеты как вам удобно</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {kpis.custom.map((kpi) => (
                <Card key={kpi.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{kpi.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    {kpi.trend && (
                      <div className={`flex items-center mt-2 ${kpi.trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.trend.direction === 'up' ? '↑' : '↓'} {kpi.trend.value}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdvancedAnalytics;
