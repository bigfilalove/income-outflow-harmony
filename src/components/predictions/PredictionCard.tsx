
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPredictions } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';

export const PredictionCard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['predictions'],
    queryFn: fetchPredictions,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // Cache for an hour
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Прогноз на следующий месяц</CardTitle>
          <CardDescription>Загрузка прогноза...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Прогноз на следующий месяц</CardTitle>
          <CardDescription>Не удалось загрузить прогноз</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Произошла ошибка при загрузке прогноза</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <CardTitle>Прогноз на следующий месяц</CardTitle>
        <CardDescription>На основе данных за последние 6 месяцев</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 md:col-span-1 flex flex-col p-3 border rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Прогноз дохода</span>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-lg font-bold text-green-500">{formatCurrency(data.predictedIncome)}</span>
            </div>
          </div>
          
          <div className="col-span-3 md:col-span-1 flex flex-col p-3 border rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Прогноз расходов</span>
            <div className="flex items-center mt-1">
              <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-lg font-bold text-red-500">{formatCurrency(data.predictedExpense)}</span>
            </div>
          </div>
          
          <div className="col-span-3 md:col-span-1 flex flex-col p-3 border rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Прогноз баланса</span>
            <div className="flex items-center mt-1">
              <Wallet className="h-4 w-4 mr-1" />
              <span className={`text-lg font-bold ${data.predictedBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(data.predictedBalance)}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Основные категории расходов на следующий месяц</h3>
          <div className="space-y-2">
            {data.topExpenseCategories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.category}</span>
                  <span>{formatCurrency(category.amount)}</span>
                </div>
                <Progress 
                  value={category.amount / data.predictedExpense * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
