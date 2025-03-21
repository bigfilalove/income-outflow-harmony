
import React from 'react';
import { useTransactions } from '@/context/transaction';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { filterTransactionsByDateRange } from '@/utils/reportUtils';

interface BalanceSheetReportProps {
  startDate?: Date;
  endDate?: Date;
}

const BalanceSheetReport: React.FC<BalanceSheetReportProps> = ({ startDate, endDate }) => {
  const { transactions } = useTransactions();
  
  // Для баланса берем все транзакции до указанной конечной даты
  const relevantTransactions = endDate
    ? transactions.filter(t => new Date(t.date) <= endDate)
    : transactions;
  
  // Расчет общих сумм
  const totalIncome = relevantTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = relevantTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const cashBalance = totalIncome - totalExpense;
  
  // Расчет активов по компаниям
  const companyAssets = relevantTransactions.reduce((acc, t) => {
    const companyName = t.company || 'Не указана';
    if (!acc[companyName]) {
      acc[companyName] = 0;
    }
    
    if (t.type === 'income') {
      acc[companyName] += t.amount;
    } else if (t.type === 'expense') {
      acc[companyName] -= t.amount;
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  // Преобразование в массив для отображения
  const companyAssetsArray = Object.entries(companyAssets)
    .map(([company, amount]) => ({ company, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  // Расчет обязательств (для упрощения используем только транзакции с отрицательным балансом по компании)
  const liabilities = companyAssetsArray
    .filter(item => item.amount < 0)
    .map(item => ({ company: item.company, amount: Math.abs(item.amount) }));
  
  // Расчет активов (только положительные балансы)
  const assets = companyAssetsArray
    .filter(item => item.amount > 0);
  
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0) + (cashBalance > 0 ? cashBalance : 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0) + (cashBalance < 0 ? Math.abs(cashBalance) : 0);
  const equity = totalAssets - totalLiabilities;
  
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">Балансовый отчет</div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Статья</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Активы</TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell className="pl-8">Денежные средства</TableCell>
            <TableCell className="text-right">{formatCurrency(cashBalance > 0 ? cashBalance : 0)}</TableCell>
          </TableRow>
          
          {assets.map((asset, index) => (
            <TableRow key={index}>
              <TableCell className="pl-8">{asset.company}</TableCell>
              <TableCell className="text-right">{formatCurrency(asset.amount)}</TableCell>
            </TableRow>
          ))}
          
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium">Итого активы</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(totalAssets)}</TableCell>
          </TableRow>
          
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Обязательства</TableCell>
          </TableRow>
          
          {cashBalance < 0 && (
            <TableRow>
              <TableCell className="pl-8">Овердрафт</TableCell>
              <TableCell className="text-right">{formatCurrency(Math.abs(cashBalance))}</TableCell>
            </TableRow>
          )}
          
          {liabilities.map((liability, index) => (
            <TableRow key={index}>
              <TableCell className="pl-8">Задолженность: {liability.company}</TableCell>
              <TableCell className="text-right">{formatCurrency(liability.amount)}</TableCell>
            </TableRow>
          ))}
          
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium">Итого обязательства</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(totalLiabilities)}</TableCell>
          </TableRow>
          
          <TableRow className="font-bold">
            <TableCell>Собственный капитал</TableCell>
            <TableCell className={cn("text-right", equity >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(equity)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default BalanceSheetReport;
