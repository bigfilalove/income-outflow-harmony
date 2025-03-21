import { Transaction } from "@/types/transaction";
import { KpiDashboardData, KpiMetric, KpiTrendData } from "@/types/kpi";
import { PredictionData } from "@/services/api/predictions";
import { getMonthNameShort } from "@/lib/date-utils";

/**
 * Calculates all KPI metrics from transaction data
 */
export const calculateKpis = (
  transactions: Transaction[],
  predictionData?: PredictionData
): KpiDashboardData => {
  // Group transactions by month for trends
  const monthlyData = getMonthlyTransactionData(transactions, 6);
  
  // Calculate profitability KPIs
  const profitability = calculateProfitabilityKpis(transactions, monthlyData);
  
  // Calculate liquidity KPIs
  const liquidity = calculateLiquidityKpis(transactions, predictionData);
  
  // Calculate turnover KPIs
  const turnover = calculateTurnoverKpis(transactions, monthlyData);
  
  // Calculate custom KPIs
  const custom = calculateCustomKpis(transactions, predictionData);
  
  // Prepare trend data
  const profitabilityTrend = calculateProfitabilityTrends(monthlyData);
  const liquidityTrend = calculateLiquidityTrends(monthlyData);
  const turnoverTrend = calculateTurnoverTrends(monthlyData);
  
  return {
    profitability,
    liquidity,
    turnover,
    custom,
    profitabilityTrend,
    liquidityTrend,
    turnoverTrend
  };
};

/**
 * Groups transactions by month for the specified number of months
 */
const getMonthlyTransactionData = (transactions: Transaction[], monthsCount: number) => {
  const now = new Date();
  const result: Record<string, { 
    income: number; 
    expense: number; 
    date: Date;
    totalTransactions: number;
  }> = {};
  
  // Initialize with recent months
  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    result[key] = { income: 0, expense: 0, date, totalTransactions: 0 };
  }
  
  // Fill with transaction data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (result[key]) {
      if (transaction.type === 'income') {
        result[key].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        result[key].expense += transaction.amount;
      }
      result[key].totalTransactions++;
    }
  });
  
  return Object.entries(result)
    .map(([key, data]) => ({
      key,
      ...data
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

/**
 * Calculate profitability KPIs
 */
const calculateProfitabilityKpis = (
  transactions: Transaction[],
  monthlyData: Array<{ key: string; income: number; expense: number; date: Date; totalTransactions: number }>
): KpiMetric[] => {
  // Total income and expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate profit margin (overall)
  const profitMargin = totalIncome > 0 
    ? (totalIncome - totalExpense) / totalIncome * 100 
    : 0;
  
  // Calculate profit margin for last month
  const lastMonth = monthlyData[monthlyData.length - 1];
  const lastMonthProfitMargin = lastMonth.income > 0 
    ? (lastMonth.income - lastMonth.expense) / lastMonth.income * 100 
    : 0;
  
  // Calculate profit margin for previous month
  const previousMonth = monthlyData[monthlyData.length - 2];
  const previousMonthProfitMargin = previousMonth?.income > 0 
    ? (previousMonth.income - previousMonth.expense) / previousMonth.income * 100 
    : 0;
  
  // Calculate profit margin trend
  const profitMarginTrend = previousMonthProfitMargin === 0
    ? { direction: 'neutral' as const, value: 'Нет данных', positive: false }
    : lastMonthProfitMargin > previousMonthProfitMargin
      ? { 
          direction: 'up' as const, 
          value: `+${(lastMonthProfitMargin - previousMonthProfitMargin).toFixed(2)}%`, 
          positive: true 
        }
      : { 
          direction: 'down' as const, 
          value: `${(lastMonthProfitMargin - previousMonthProfitMargin).toFixed(2)}%`, 
          positive: false 
        };
  
  // Calculate ROI
  const investments = transactions
    .filter(t => t.type === 'expense' && t.category === 'Инвестиции')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const roi = investments > 0 
    ? (totalIncome - totalExpense) / investments * 100 
    : 0;
  
  // Calculate cost efficiency ratio
  const costEfficiency = totalExpense > 0 
    ? totalIncome / totalExpense 
    : 0;
  
  // Calculate cost efficiency trend
  const previousMonthCostEfficiency = previousMonth?.expense > 0 
    ? previousMonth.income / previousMonth.expense 
    : 0;
  
  const lastMonthCostEfficiency = lastMonth.expense > 0 
    ? lastMonth.income / lastMonth.expense 
    : 0;
  
  const costEfficiencyTrend = previousMonthCostEfficiency === 0 
    ? { direction: 'neutral' as const, value: 'Нет данных', positive: false }
    : lastMonthCostEfficiency > previousMonthCostEfficiency
      ? { 
          direction: 'up' as const, 
          value: `+${((lastMonthCostEfficiency - previousMonthCostEfficiency) * 100).toFixed(2)}%`, 
          positive: true 
        }
      : { 
          direction: 'down' as const, 
          value: `${((lastMonthCostEfficiency - previousMonthCostEfficiency) * 100).toFixed(2)}%`, 
          positive: false 
        };
  
  return [
    {
      id: 'profit-margin',
      title: 'Маржа прибыли',
      description: 'Рентабельность по чистой прибыли',
      value: profitMargin,
      format: 'percentage',
      trend: profitMarginTrend,
      comparison: 'По сравнению с прошлым месяцем',
      category: 'profitability'
    },
    {
      id: 'roi',
      title: 'ROI',
      description: 'Рентабельность инвестиций',
      value: roi,
      format: 'percentage',
      comparison: 'Доход на каждый вложенный рубль',
      category: 'profitability'
    },
    {
      id: 'cost-efficiency',
      title: 'Эффективность затрат',
      description: 'Отношение доходов к расходам',
      value: costEfficiency,
      format: 'number',
      trend: costEfficiencyTrend,
      comparison: 'По сравнению с прошлым месяцем',
      category: 'profitability'
    }
  ];
};

/**
 * Calculate liquidity KPIs
 */
const calculateLiquidityKpis = (
  transactions: Transaction[],
  predictionData?: PredictionData
): KpiMetric[] => {
  // Calculate total income and expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate current ratio
  const currentAssets = totalIncome; // Simplified assumption
  const currentLiabilities = totalExpense; // Simplified assumption
  
  const currentRatio = currentLiabilities > 0 
    ? currentAssets / currentLiabilities 
    : 0;
  
  // Calculate quick ratio (with the same simplified assumption)
  const quickRatio = currentRatio;
  
  // Calculate cash ratio
  const cashRatio = currentLiabilities > 0 
    ? (totalIncome - totalExpense) / currentLiabilities 
    : 0;
  
  // Estimated runway based on current burn rate
  const lastThreeMonthsDate = new Date();
  lastThreeMonthsDate.setMonth(lastThreeMonthsDate.getMonth() - 3);
  
  const recentExpenses = transactions
    .filter(t => 
      t.type === 'expense' && 
      new Date(t.date) >= lastThreeMonthsDate
    );
  
  const monthlyBurnRate = recentExpenses.length > 0
    ? recentExpenses.reduce((sum, t) => sum + t.amount, 0) / 3
    : 0;
  
  const cashRunway = monthlyBurnRate > 0
    ? (totalIncome - totalExpense) / monthlyBurnRate
    : 0;
  
  // Cash flow trend using predictions
  const cashFlowTrend = predictionData
    ? {
        direction: predictionData.predictedIncome >= predictionData.predictedExpense ? 'up' as const : 'down' as const,
        value: `${Math.abs(predictionData.predictedIncome - predictionData.predictedExpense).toFixed(0)} ₽`,
        positive: predictionData.predictedIncome >= predictionData.predictedExpense
      }
    : undefined;
  
  return [
    {
      id: 'current-ratio',
      title: 'Текущая ликвидность',
      description: 'Отношение текущих активов к текущим обязательствам',
      value: currentRatio,
      format: 'number',
      comparison: 'Рекомендуемое значение: > 2',
      category: 'liquidity'
    },
    {
      id: 'quick-ratio',
      title: 'Быстрая ликвидность',
      description: 'Отношение быстрых активов к текущим обязательствам',
      value: quickRatio,
      format: 'number',
      comparison: 'Рекомендуемое значение: > 1',
      category: 'liquidity'
    },
    {
      id: 'cash-ratio',
      title: 'Денежная ликвидность',
      description: 'Отношение денежных средств к текущим обязательствам',
      value: cashRatio,
      format: 'number',
      comparison: 'Рекомендуемое значение: > 0.2',
      category: 'liquidity'
    },
    {
      id: 'cash-runway',
      title: 'Запас хода',
      description: 'Количество месяцев до исчерпания средств',
      value: cashRunway,
      format: 'number',
      trend: cashFlowTrend,
      comparison: 'При текущем уровне расходов',
      category: 'liquidity'
    }
  ];
};

/**
 * Calculate turnover KPIs
 */
const calculateTurnoverKpis = (
  transactions: Transaction[],
  monthlyData: Array<{ key: string; income: number; expense: number; date: Date; totalTransactions: number }>
): KpiMetric[] => {
  // Total income and transactions in the last 3 months
  const lastThreeMonthsDate = new Date();
  lastThreeMonthsDate.setMonth(lastThreeMonthsDate.getMonth() - 3);
  
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= lastThreeMonthsDate
  );
  
  const recentIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Group transactions by company
  const companyTransactions: Record<string, { income: number; count: number }> = {};
  
  recentTransactions
    .filter(t => t.type === 'income' && t.company)
    .forEach(t => {
      const company = t.company || 'Не указана';
      if (!companyTransactions[company]) {
        companyTransactions[company] = { income: 0, count: 0 };
      }
      companyTransactions[company].income += t.amount;
      companyTransactions[company].count++;
    });
  
  // Calculate average transaction value
  const avgTransactionValue = recentTransactions.length > 0
    ? recentIncome / recentTransactions.filter(t => t.type === 'income').length
    : 0;
  
  // Calculate transaction frequency (per month)
  const transactionFrequency = recentTransactions.length / 3;
  
  // Calculate customer concentration (top customer percentage)
  const sortedCompanies = Object.entries(companyTransactions)
    .map(([company, data]) => ({ company, ...data }))
    .sort((a, b) => b.income - a.income);
  
  const topCustomerPercentage = recentIncome > 0 && sortedCompanies.length > 0
    ? (sortedCompanies[0].income / recentIncome) * 100
    : 0;
  
  // Calculate monthly transaction growth
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const transactionGrowth = previousMonth && previousMonth.totalTransactions > 0
    ? ((currentMonth.totalTransactions - previousMonth.totalTransactions) / previousMonth.totalTransactions) * 100
    : 0;
  
  const transactionGrowthTrend = {
    direction: transactionGrowth >= 0 ? 'up' as const : 'down' as const,
    value: `${Math.abs(transactionGrowth).toFixed(2)}%`,
    positive: transactionGrowth >= 0
  };
  
  return [
    {
      id: 'avg-transaction',
      title: 'Средняя транзакция',
      description: 'Средняя стоимость транзакции',
      value: avgTransactionValue,
      format: 'currency',
      comparison: 'За последние 3 месяца',
      category: 'turnover'
    },
    {
      id: 'transaction-frequency',
      title: 'Частота транзакций',
      description: 'Количество транзакций в месяц',
      value: transactionFrequency,
      format: 'number',
      trend: transactionGrowthTrend,
      comparison: 'Среднее за последние 3 месяца',
      category: 'turnover'
    },
    {
      id: 'customer-concentration',
      title: 'Концентрация клиентов',
      description: 'Процент дохода от крупнейшего клиента',
      value: topCustomerPercentage,
      format: 'percentage',
      comparison: 'За последние 3 месяца',
      category: 'turnover'
    }
  ];
};

/**
 * Calculate custom KPIs
 */
const calculateCustomKpis = (
  transactions: Transaction[],
  predictionData?: PredictionData
): KpiMetric[] => {
  // Total income and expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate net profit
  const netProfit = totalIncome - totalExpense;
  
  // Calculate predicted growth
  const predictedGrowth = predictionData
    ? ((predictionData.predictedBalance - predictionData.currentBalance) / predictionData.currentBalance) * 100
    : 0;
  
  const predictedGrowthTrend = predictionData
    ? {
        direction: predictedGrowth >= 0 ? 'up' as const : 'down' as const,
        value: `${Math.abs(predictedGrowth).toFixed(2)}%`,
        positive: predictedGrowth >= 0
      }
    : undefined;
  
  // Calculate efficiency by category
  const categoryExpenses: Record<string, number> = {};
  const categoryIncomes: Record<string, number> = {};
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    } else if (t.type === 'income') {
      categoryIncomes[t.category] = (categoryIncomes[t.category] || 0) + t.amount;
    }
  });
  
  // Find top expense category
  let topExpenseCategory = '';
  let topExpenseAmount = 0;
  
  Object.entries(categoryExpenses).forEach(([category, amount]) => {
    if (amount > topExpenseAmount) {
      topExpenseCategory = category;
      topExpenseAmount = amount;
    }
  });
  
  // Calculate expense ratio for top category
  const topCategoryRatio = totalExpense > 0
    ? (topExpenseAmount / totalExpense) * 100
    : 0;
  
  return [
    {
      id: 'net-profit',
      title: 'Чистая прибыль',
      description: 'Общий доход за вычетом расходов',
      value: netProfit,
      format: 'currency',
      comparison: 'За все время',
      category: 'custom'
    },
    {
      id: 'predicted-growth',
      title: 'Прогноз роста',
      description: 'Ожидаемый рост в следующем месяце',
      value: predictedGrowth,
      format: 'percentage',
      trend: predictedGrowthTrend,
      comparison: 'На основе исторических данных',
      category: 'custom'
    },
    {
      id: 'top-expense',
      title: 'Основная статья расходов',
      description: topExpenseCategory,
      value: topCategoryRatio,
      format: 'percentage',
      comparison: `${topExpenseCategory}: ${Math.round(topExpenseAmount).toLocaleString()} ₽`,
      category: 'custom'
    }
  ];
};

/**
 * Calculate trends for profitability metrics
 */
const calculateProfitabilityTrends = (
  monthlyData: Array<{ key: string; income: number; expense: number; date: Date; totalTransactions: number }>
): KpiTrendData[] => {
  return monthlyData.map(month => {
    const profitMargin = month.income > 0 
      ? ((month.income - month.expense) / month.income) * 100 
      : 0;
      
    const costEfficiency = month.expense > 0 
      ? month.income / month.expense 
      : 0;
      
    return {
      period: getMonthNameShort(month.date.getMonth()),
      'Маржа прибыли (%)': Math.round(profitMargin * 100) / 100,
      'Эффективность затрат': Math.round(costEfficiency * 100) / 100
    };
  });
};

/**
 * Calculate trends for liquidity metrics
 */
const calculateLiquidityTrends = (
  monthlyData: Array<{ key: string; income: number; expense: number; date: Date; totalTransactions: number }>
): KpiTrendData[] => {
  // Calculate cumulative values
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;
  
  return monthlyData.map(month => {
    cumulativeIncome += month.income;
    cumulativeExpense += month.expense;
    
    const currentRatio = cumulativeExpense > 0 
      ? cumulativeIncome / cumulativeExpense 
      : 0;
      
    const cashRatio = cumulativeExpense > 0 
      ? (cumulativeIncome - cumulativeExpense) / cumulativeExpense 
      : 0;
      
    return {
      period: getMonthNameShort(month.date.getMonth()),
      'Текущая ликвидность': Math.round(currentRatio * 100) / 100,
      'Денежная ликвидность': Math.round(cashRatio * 100) / 100
    };
  });
};

/**
 * Calculate trends for turnover metrics
 */
const calculateTurnoverTrends = (
  monthlyData: Array<{ key: string; income: number; expense: number; date: Date; totalTransactions: number }>
): KpiTrendData[] => {
  return monthlyData.map(month => {
    const avgTransactionValue = month.totalTransactions > 0 
      ? month.income / month.totalTransactions 
      : 0;
      
    return {
      period: getMonthNameShort(month.date.getMonth()),
      'Транзакции': month.totalTransactions,
      'Средняя транзакция': Math.round(avgTransactionValue)
    };
  });
};
