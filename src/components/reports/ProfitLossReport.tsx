
import React from 'react';
import { useTransactions } from '@/context/transaction';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { filterTransactionsByDateRange } from '@/utils/reportUtils';
import { useAnalytics } from '@/hooks/use-analytics';

interface ProfitLossReportProps {
  startDate?: Date;
  endDate?: Date;
}

const ProfitLossReport: React.FC<ProfitLossReportProps> = ({ startDate, endDate }) => {
  const { transactions } = useTransactions();
  const analytics = useAnalytics();
  
  // Фильтрация транзакций по выбранному периоду
  const filteredTransactions = startDate && endDate
    ? filterTransactionsByDateRange(transactions, startDate, endDate)
    : transactions;
  
  // Получение данных для отчета о прибылях и убытках
  const incomeCategories = analytics.topIncomeCategories.map(cat => ({
    category: cat.category,
    amount: filteredTransactions
      .filter(t => t.type === 'income' && t.category === cat.category)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.amount > 0);
  
  const expenseCategories = analytics.topExpenseCategories.map(cat => ({
    category: cat.category,
    amount: filteredTransactions
      .filter(t => t.type === 'expense' && t.category === cat.category)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.amount > 0);
  
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const netProfit = totalIncome - totalExpense;
  
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">Отчет о прибылях и убытках</div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Категория</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Доходы</TableCell>
          </TableRow>
          
          {incomeCategories.length > 0 ? (
            incomeCategories.map((category, index) => (
              <TableRow key={index}>
                <TableCell className="pl-8">{category.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(category.amount)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="pl-8">Нет данных о доходах</TableCell>
              <TableCell className="text-right">0 ₽</TableCell>
            </TableRow>
          )}
          
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium">Итого доходы</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(totalIncome)}</TableCell>
          </TableRow>
          
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Расходы</TableCell>
          </TableRow>
          
          {expenseCategories.length > 0 ? (
            expenseCategories.map((category, index) => (
              <TableRow key={index}>
                <TableCell className="pl-8">{category.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(category.amount)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="pl-8">Нет данных о расходах</TableCell>
              <TableCell className="text-right">0 ₽</TableCell>
            </TableRow>
          )}
          
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium">Итого расходы</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(totalExpense)}</TableCell>
          </TableRow>
          
          <TableRow className="font-bold">
            <TableCell>Чистая прибыль</TableCell>
            <TableCell className={cn("text-right", netProfit >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(netProfit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfitLossReport;
