
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

  // Find min and max values for better Y axis scaling
  const minMaxValues = metrics.reduce((acc, metric) => {
    const values = data.map(item => Number(item[metric]) || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    if (min < acc.min) acc.min = min;
    if (max > acc.max) acc.max = max;
    
    return acc;
  }, { min: Infinity, max: -Infinity });

  // Add padding to min/max values for better visualization
  const yAxisDomain = [
    minMaxValues.min > 0 ? 0 : minMaxValues.min * 1.1,
    minMaxValues.max * 1.1
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
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="period" 
            padding={{ left: 30, right: 30 }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            domain={yAxisDomain as [number, number]}
            padding={{ top: 20, bottom: 20 }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            width={50}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
          />
          {metrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={metric}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              connectNulls={true}
              activeDot={{ r: 8, strokeWidth: 1 }}
              dot={{ r: 4, strokeWidth: 1 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default KpiChart;
