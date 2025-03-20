
import React from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transactionCategories } from '@/types/transaction';
import { formatCurrency } from '@/lib/formatters';

const FinanceSummary: React.FC = () => {
  const { transactions } = useTransactions();
  
  // Calculate category totals
  const getCategoryData = (type: 'income' | 'expense') => {
    const data: { [key: string]: number } = {};
    
    // Initialize all categories to 0
    (type === 'income' ? transactionCategories.income : transactionCategories.expense)
      .forEach(category => {
        data[category] = 0;
      });
    
    // Sum transactions by category
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    
    // Convert to array format for charts
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  };

  const incomeData = getCategoryData('income');
  const expenseData = getCategoryData('expense');

  // Calculate monthly data
  const getMonthlyData = () => {
    const months: { [key: string]: { income: number; expense: number } } = {};
    
    // Get last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('ru-RU', { month: 'short' });
      months[monthKey] = { income: 0, expense: 0 };
    }
    
    // Sum transactions by month
    transactions.forEach(t => {
      const monthKey = t.date.toLocaleDateString('ru-RU', { month: 'short' });
      if (months[monthKey]) {
        months[monthKey][t.type] += t.amount;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(months).map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense
    }));
  };

  const monthlyData = getMonthlyData();

  // Colors for pie charts
  const INCOME_COLORS = ['#34D399', '#10B981', '#059669', '#047857', '#065F46'];
  const EXPENSE_COLORS = ['#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" name="Доходы" fill="#34D399" />
                  <Bar dataKey="expense" name="Расходы" fill="#F87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="category" className="pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-center mb-2 font-medium">Доходы по категориям</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {incomeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-center mb-2 font-medium">Расходы по категориям</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceSummary;
