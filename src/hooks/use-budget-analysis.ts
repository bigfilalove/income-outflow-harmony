
import { useMemo } from 'react';
import { useBudgets } from '@/context/BudgetContext';
import { useTransactions } from '@/context/TransactionContext';
import { BudgetPeriod, BudgetSummary, BudgetVariance } from '@/types/budget';
import { getStartOfMonth, getEndOfMonth } from '@/lib/date-utils';

export function useBudgetAnalysis() {
  const { budgets, getBudgetsByPeriod } = useBudgets();
  const { transactions } = useTransactions();

  const getBudgetSummary = (period: BudgetPeriod, year: number, month: number): BudgetSummary => {
    // Получаем бюджеты для указанного периода
    const periodBudgets = getBudgetsByPeriod(period, year, month);
    
    // Определяем даты начала и конца периода для фильтрации транзакций
    let startDate: Date;
    let endDate: Date;
    
    if (period === 'monthly') {
      startDate = getStartOfMonth(new Date(year, month - 1));
      endDate = getEndOfMonth(new Date(year, month - 1));
    } else if (period === 'quarterly') {
      // Для квартала: 1 -> янв-март, 2 -> апр-июнь, 3 -> июл-сент, 4 -> окт-дек
      const startMonth = (month - 1) * 3;
      startDate = getStartOfMonth(new Date(year, startMonth));
      endDate = getEndOfMonth(new Date(year, startMonth + 2));
    } else { // annual
      startDate = getStartOfMonth(new Date(year, 0)); // январь
      endDate = getEndOfMonth(new Date(year, 11)); // декабрь
    }
    
    // Фильтруем транзакции по дате и типу (расход)
    const expenseTransactions = transactions.filter(t => 
      t.type === 'expense' && 
      new Date(t.date) >= startDate && 
      new Date(t.date) <= endDate
    );
    
    // Группируем фактические расходы по категориям
    const actualByCategory: Record<string, number> = {};
    expenseTransactions.forEach(transaction => {
      actualByCategory[transaction.category] = (actualByCategory[transaction.category] || 0) + transaction.amount;
    });
    
    // Создаем массив категорий с отклонениями
    const categories: BudgetVariance[] = [];
    
    // Сначала добавляем категории из бюджетов
    periodBudgets
      .filter(budget => budget.type === 'expense')
      .forEach(budget => {
        const actualAmount = actualByCategory[budget.category] || 0;
        const variance = budget.amount - actualAmount;
        const variancePercentage = budget.amount !== 0 
          ? (variance / budget.amount) * 100 
          : actualAmount === 0 ? 0 : -100;
        
        categories.push({
          category: budget.category,
          budgetAmount: budget.amount,
          actualAmount,
          variance,
          variancePercentage
        });
        
        // Удаляем обработанную категорию
        delete actualByCategory[budget.category];
      });
    
    // Затем добавляем категории, которые есть в фактических расходах, но нет в бюджетах
    Object.entries(actualByCategory).forEach(([category, actualAmount]) => {
      if (actualAmount > 0) {
        categories.push({
          category,
          budgetAmount: 0,
          actualAmount,
          variance: -actualAmount, // Отрицательное отклонение (перерасход)
          variancePercentage: -100 // 100% перерасход
        });
      }
    });
    
    // Сортируем категории по размеру отклонения (от наибольшего перерасхода к экономии)
    categories.sort((a, b) => a.variance - b.variance);
    
    // Рассчитываем итоговые суммы
    const totalBudget = periodBudgets
      .filter(budget => budget.type === 'expense')
      .reduce((sum, budget) => sum + budget.amount, 0);
      
    const totalActual = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const variance = totalBudget - totalActual;
    const variancePercentage = totalBudget !== 0 
      ? (variance / totalBudget) * 100 
      : totalActual === 0 ? 0 : -100;
    
    return {
      period,
      year,
      month,
      totalBudget,
      totalActual,
      variance,
      variancePercentage,
      categories
    };
  };
  
  return { getBudgetSummary };
}
