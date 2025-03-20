
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { INCOME_COLORS, EXPENSE_COLORS } from '@/utils/chartUtils';

interface CategoryItem {
  name: string;
  value: number;
}

interface CategoryChartsProps {
  incomeData: CategoryItem[];
  expenseData: CategoryItem[];
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({ incomeData, expenseData }) => {
  return (
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
  );
};

export default CategoryCharts;
