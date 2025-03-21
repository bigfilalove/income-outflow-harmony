
import React, { useState } from 'react';
import { useBudgetAnalysis } from '@/hooks/use-budget-analysis';
import { BudgetPeriod, BudgetSummary } from '@/types/budget';
import { formatCurrency } from '@/lib/formatters';
import {
  getMonthsList,
  getQuartersList,
  getYearsList,
} from '@/lib/date-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';

const BudgetAnalysis: React.FC = () => {
  const { getBudgetSummary } = useBudgetAnalysis();
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil((new Date().getMonth() + 1) / 3));
  
  const years = getYearsList();
  const months = getMonthsList();
  const quarters = getQuartersList();
  
  // Получаем данные анализа бюджета
  const getActualMonth = selectedPeriod === 'monthly' ? selectedMonth : 
                         selectedPeriod === 'quarterly' ? selectedQuarter : 1;
  
  const budgetSummary: BudgetSummary = getBudgetSummary(
    selectedPeriod,
    selectedYear,
    getActualMonth
  );
  
  const handlePeriodChange = (value: string) => {
    const period = value as BudgetPeriod;
    setSelectedPeriod(period);
    
    // Сбрасываем месяц/квартал при смене периода
    if (period === 'monthly') {
      setSelectedMonth(new Date().getMonth() + 1);
    } else if (period === 'quarterly') {
      setSelectedQuarter(Math.ceil((new Date().getMonth() + 1) / 3));
    }
  };
  
  // Получаем название текущего периода
  const getPeriodTitle = () => {
    if (selectedPeriod === 'monthly') {
      const monthName = months.find(m => m.value === selectedMonth)?.label || '';
      return `${monthName} ${selectedYear}`;
    } else if (selectedPeriod === 'quarterly') {
      return `${selectedQuarter} квартал ${selectedYear}`;
    } else {
      return `${selectedYear} год`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Факт vs План</CardTitle>
        <CardDescription>
          Анализ отклонений от бюджета для периода: {getPeriodTitle()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Период</label>
              <Select 
                value={selectedPeriod} 
                onValueChange={handlePeriodChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                  <SelectItem value="quarterly">Ежеквартально</SelectItem>
                  <SelectItem value="annual">Ежегодно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Год</label>
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите год" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedPeriod === 'monthly' && (
              <div>
                <label className="text-sm font-medium">Месяц</label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите месяц" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedPeriod === 'quarterly' && (
              <div>
                <label className="text-sm font-medium">Квартал</label>
                <Select 
                  value={selectedQuarter.toString()} 
                  onValueChange={(value) => setSelectedQuarter(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите квартал" />
                  </SelectTrigger>
                  <SelectContent>
                    {quarters.map((quarter) => (
                      <SelectItem key={quarter.value} value={quarter.value.toString()}>
                        {quarter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Сводка по бюджету */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Бюджет</div>
              <div className="text-2xl font-bold">{formatCurrency(budgetSummary.totalBudget)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Факт</div>
              <div className="text-2xl font-bold">{formatCurrency(budgetSummary.totalActual)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">
                Отклонение ({budgetSummary.variancePercentage.toFixed(1)}%)
              </div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${
                budgetSummary.variance >= 0 ? 'text-green-500' : 'text-destructive'
              }`}>
                {formatCurrency(Math.abs(budgetSummary.variance))}
                {budgetSummary.variance > 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : budgetSummary.variance < 0 ? (
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                ) : null}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {budgetSummary.variance >= 0
                  ? 'Экономия бюджета'
                  : 'Перерасход бюджета'}
              </div>
            </div>
          </div>
          
          {/* Прогресс использования бюджета */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Использование бюджета</div>
              <div className="text-sm text-muted-foreground">
                {budgetSummary.totalBudget > 0
                  ? Math.min(100, (budgetSummary.totalActual / budgetSummary.totalBudget) * 100).toFixed(1)
                  : '0'}% использовано
              </div>
            </div>
            <Progress 
              value={budgetSummary.totalBudget > 0 
                ? Math.min(100, (budgetSummary.totalActual / budgetSummary.totalBudget) * 100) 
                : 0
              } 
              className={budgetSummary.totalActual > budgetSummary.totalBudget ? 'bg-destructive/20' : ''}
            />
          </div>
          
          {/* Таблица отклонений по категориям */}
          {budgetSummary.categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Категория</TableHead>
                  <TableHead className="text-right">Бюджет</TableHead>
                  <TableHead className="text-right">Факт</TableHead>
                  <TableHead className="text-right">Отклонение</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetSummary.categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {category.variance < 0 && category.variancePercentage < -10 && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        {category.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(category.budgetAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(category.actualAmount)}</TableCell>
                    <TableCell className={`text-right ${
                      category.variance >= 0 ? 'text-green-500' : 'text-destructive'
                    }`}>
                      {category.variance > 0 ? '+' : ''}{formatCurrency(category.variance)}
                    </TableCell>
                    <TableCell className={`text-right ${
                      category.variancePercentage >= 0 ? 'text-green-500' : 'text-destructive'
                    }`}>
                      {category.variancePercentage > 0 ? '+' : ''}
                      {category.variancePercentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">Нет данных для анализа отклонений.</p>
              <p className="text-muted-foreground text-sm mt-2">
                Добавьте бюджеты для выбранного периода и категорий расходов.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetAnalysis;
