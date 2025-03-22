
import React from 'react';
import { KpiTrendData } from '@/types/kpi';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface KpiChartProps {
  data: KpiTrendData[];
}

const KpiChart: React.FC<KpiChartProps> = ({ data }) => {
  // Extract metrics from the first data point to get all available metrics
  const metrics = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'period')
    : [];
  
  // Define colors for each metric
  const colors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#3B82F6'  // Blue
  ];

  return (
    <ChartContainer
      config={{
        // Define a color config for each metric
        ...Object.fromEntries(metrics.map((metric, index) => [
          metric, 
          { color: colors[index % colors.length] }
        ]))
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="period" 
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            padding={{ top: 20, bottom: 20 }}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
          <Legend />
          {metrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={metric}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default KpiChart;
