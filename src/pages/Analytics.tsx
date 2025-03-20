
import React from 'react';
import Navbar from '@/components/Navbar';
import FinanceSummary from '@/components/FinanceSummary';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/formatters';

const Analytics = () => {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const efficiency = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Get categories with highest income and expense
  const getCategoryTotal = (type: 'income' | 'expense') => {
    const categories: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
      
    return Object.entries(categories)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  };

  const topIncomeCategories = getCategoryTotal('income');
  const topExpenseCategories = getCategoryTotal('expense');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
          <ReportDownloadDialog reportType="analytics" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-slideUp">
            <CardHeader>
              <CardTitle>Финансовый обзор</CardTitle>
              <CardDescription>Ключевые финансовые показатели</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Общий доход</div>
                  <div className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Общий расход</div>
                  <div className="text-2xl font-bold text-expense">{formatCurrency(totalExpense)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Текущий баланс</div>
                  <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Эффективность</div>
                  <div className="text-2xl font-bold">{Math.round(efficiency)}%</div>
                  <div className="text-xs text-muted-foreground">
                    Процент дохода, сохраненный после расходов
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp md:col-span-2">
            <CardHeader>
              <CardTitle>Топ категорий</CardTitle>
              <CardDescription>Наиболее значительные источники доходов и расходов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Доходы</h3>
                  <div className="space-y-3">
                    {topIncomeCategories.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.category}</span>
                        <span className="font-medium text-income">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Расходы</h3>
                  <div className="space-y-3">
                    {topExpenseCategories.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.category}</span>
                        <span className="font-medium text-expense">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <FinanceSummary />
      </main>
    </div>
  );
};

export default Analytics;
