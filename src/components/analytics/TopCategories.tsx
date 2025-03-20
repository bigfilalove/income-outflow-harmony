
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';

interface CategoryItem {
  category: string;
  total: number;
}

interface TopCategoriesProps {
  topIncomeCategories: CategoryItem[];
  topExpenseCategories: CategoryItem[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({
  topIncomeCategories,
  topExpenseCategories
}) => {
  return (
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
  );
};

export default TopCategories;
