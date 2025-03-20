
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';

interface FinancialOverviewProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  efficiency: number;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalIncome,
  totalExpense,
  balance,
  efficiency
}) => {
  return (
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
  );
};

export default FinancialOverview;
