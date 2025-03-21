
export interface KpiTrend {
  direction: 'up' | 'down' | 'neutral';
  value: string;
  positive: boolean; // Whether the trend is positive or negative for business
}

export interface KpiMetric {
  id: string;
  title: string;
  description: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  trend?: KpiTrend;
  comparison?: string;
  category: 'profitability' | 'liquidity' | 'turnover' | 'custom';
}

export interface KpiTrendData {
  period: string;
  [key: string]: number | string;
}

export interface KpiDashboardData {
  profitability: KpiMetric[];
  liquidity: KpiMetric[];
  turnover: KpiMetric[];
  custom: KpiMetric[];
  profitabilityTrend: KpiTrendData[];
  liquidityTrend: KpiTrendData[];
  turnoverTrend: KpiTrendData[];
}

// Removing the module declaration since we're now exporting ReportType 
// directly from ReportDownloadDialog.tsx
