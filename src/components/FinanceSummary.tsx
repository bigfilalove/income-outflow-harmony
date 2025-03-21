
import React from 'react';
import { useTransactions } from '@/context/transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategoryData, getMonthlyData } from '@/utils/chartUtils';
import MonthlyChart from '@/components/finance/MonthlyChart';
import CategoryCharts from '@/components/finance/CategoryCharts';

const FinanceSummary: React.FC = () => {
  const { transactions } = useTransactions();
  
  // Get data for charts
  const incomeData = getCategoryData(transactions, 'income');
  const expenseData = getCategoryData(transactions, 'expense');
  const monthlyData = getMonthlyData(transactions);

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <CardTitle>Финансовая сводка</CardTitle>
        <CardDescription>Визуализация доходов и расходов</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">По месяцам</TabsTrigger>
            <TabsTrigger value="category">По категориям</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="pt-4">
            <MonthlyChart data={monthlyData} />
          </TabsContent>
          <TabsContent value="category" className="pt-4">
            <CategoryCharts incomeData={incomeData} expenseData={expenseData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceSummary;
