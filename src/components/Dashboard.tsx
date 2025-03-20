
import React from 'react';
import { BarChart3, ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/formatters';
import StatCard from './StatCard';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const isMobile = useIsMobile();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate current month totals
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' && 
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpense = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate previous month totals for trend calculation
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' && 
             transactionDate.getMonth() === previousMonth &&
             transactionDate.getFullYear() === previousMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthExpense = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === previousMonth &&
             transactionDate.getFullYear() === previousMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate trends
  const incomeTrend = previousMonthIncome === 0 
    ? 'neutral' 
    : currentMonthIncome >= previousMonthIncome ? 'up' : 'down';
  
  const expenseTrend = previousMonthExpense === 0 
    ? 'neutral' 
    : currentMonthExpense >= previousMonthExpense ? 'up' : 'down';

  const incomeTrendValue = previousMonthIncome === 0 
    ? 'Нет данных за прошлый месяц' 
    : `${Math.abs(Math.round((currentMonthIncome - previousMonthIncome) / previousMonthIncome * 100))}% по сравнению с прошлым месяцем`;
  
  const expenseTrendValue = previousMonthExpense === 0 
    ? 'Нет данных за прошлый месяц' 
    : `${Math.abs(Math.round((currentMonthExpense - previousMonthExpense) / previousMonthExpense * 100))}% по сравнению с прошлым месяцем`;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slideUp">
      <StatCard
        title="Баланс"
        value={formatCurrency(balance)}
        icon={<TrendingUp className="h-5 w-5" />}
        description="Текущий баланс компании"
        className={isMobile ? "md:col-span-2" : "lg:col-span-3"}
      />
      
      <StatCard
        title="Доходы"
        value={formatCurrency(totalIncome)}
        icon={<ArrowDownCircle className="h-5 w-5" />}
        description={`${formatCurrency(currentMonthIncome)} в этом месяце`}
        trend={incomeTrend}
        trendValue={incomeTrendValue}
      />
      
      <StatCard
        title="Расходы"
        value={formatCurrency(totalExpense)}
        icon={<ArrowUpCircle className="h-5 w-5" />}
        description={`${formatCurrency(currentMonthExpense)} в этом месяце`}
        trend={expenseTrend === 'up' ? 'down' : expenseTrend === 'down' ? 'up' : 'neutral'}
        trendValue={expenseTrendValue}
      />
      
      <StatCard
        title="Отчеты"
        value="Доступно"
        icon={<BarChart3 className="h-5 w-5" />}
        description="Аналитические данные"
      />
    </div>
  );
};

export default Dashboard;
