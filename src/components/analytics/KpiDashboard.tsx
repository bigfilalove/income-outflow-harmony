
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiMetric, KpiTrendData } from '@/types/kpi';
import KpiChart from './KpiChart';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface KpiDashboardProps {
  title: string;
  kpis: KpiMetric[];
  chartData?: KpiTrendData[];
}

const KpiDashboard: React.FC<KpiDashboardProps> = ({ title, kpis, chartData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{kpi.title}</CardTitle>
              <CardDescription>{kpi.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.format === 'currency' 
                  ? formatCurrency(kpi.value) 
                  : kpi.format === 'percentage' 
                    ? formatPercentage(kpi.value) 
                    : kpi.value}
              </div>
              
              {kpi.trend && (
                <div className="flex items-center gap-1 mt-2">
                  {kpi.trend.direction === 'up' ? (
                    <div className={kpi.trend.positive ? 'text-green-500' : 'text-red-500'}>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className={kpi.trend.positive ? 'text-green-500' : 'text-red-500'}>
                      <TrendingDown className="h-4 w-4" />
                    </div>
                  )}
                  <span className={`text-sm ${kpi.trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.trend.value}
                  </span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-1">
                {kpi.comparison}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {chartData && chartData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Динамика показателей</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <KpiChart data={chartData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KpiDashboard;
