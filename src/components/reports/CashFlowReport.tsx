
import React, { useMemo } from 'react';
import { useTransactions } from '@/context/transaction';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { filterTransactionsByDateRange } from '@/utils/reportUtils';

interface CashFlowReportProps {
  startDate?: Date;
  endDate?: Date;
}

const CashFlowReport: React.FC<CashFlowReportProps> = ({ startDate, endDate }) => {
  const { transactions } = useTransactions();
  
  // Фильтрация транзакций по выбранному периоду
  const filteredTransactions = useMemo(() => {
    if (startDate && endDate) {
      return filterTransactionsByDateRange(transactions, startDate, endDate);
    }
    return transactions;
  }, [transactions, startDate, endDate]);
  
  // Группировка транзакций по месяцам
  const transactionsByMonth = useMemo(() => {
    const months: Record<string, { date: Date, income: number, expense: number, balance: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          income: 0,
          expense: 0,
          balance: 0
        };
      }
      
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
        months[monthKey].balance += transaction.amount;
      } else if (transaction.type === 'expense') {
        months[monthKey].expense += transaction.amount;
        months[monthKey].balance -= transaction.amount;
      }
    });
    
    return Object.values(months).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredTransactions]);
  
  // Расчет общих операционных, инвестиционных и финансовых денежных потоков
  const cashFlowCategories = useMemo(() => {
    // Упрощенная категоризация для примера
    const operatingCategories = ['Продажи', 'Зарплаты', 'Аренда', 'Коммунальные услуги', 'Налоги', 'Другое'];
    const investingCategories = ['Инвестиции', 'Оборудование'];
    const financingCategories = ['Кредиты'];
    
    const operating = filteredTransactions
      .filter(t => operatingCategories.includes(t.category))
      .reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount;
      }, 0);
      
    const investing = filteredTransactions
      .filter(t => investingCategories.includes(t.category))
      .reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount;
      }, 0);
      
    const financing = filteredTransactions
      .filter(t => financingCategories.includes(t.category))
      .reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount;
      }, 0);
      
    return { operating, investing, financing };
  }, [filteredTransactions]);
  
  const netCashFlow = cashFlowCategories.operating + cashFlowCategories.investing + cashFlowCategories.financing;
  
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">Отчет о движении денежных средств</div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Вид деятельности</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Операционная деятельность</TableCell>
            <TableCell className={cn("text-right", cashFlowCategories.operating >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(cashFlowCategories.operating)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Инвестиционная деятельность</TableCell>
            <TableCell className={cn("text-right", cashFlowCategories.investing >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(cashFlowCategories.investing)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Финансовая деятельность</TableCell>
            <TableCell className={cn("text-right", cashFlowCategories.financing >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(cashFlowCategories.financing)}
            </TableCell>
          </TableRow>
          <TableRow className="font-bold">
            <TableCell>Чистый денежный поток</TableCell>
            <TableCell className={cn("text-right", netCashFlow >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(netCashFlow)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="text-lg font-medium mt-6">Движение денежных средств по месяцам</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Месяц</TableHead>
            <TableHead className="text-right">Поступления</TableHead>
            <TableHead className="text-right">Расходы</TableHead>
            <TableHead className="text-right">Баланс</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionsByMonth.map((month, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(month.date).toLocaleDateString('ru-RU', {month: 'long', year: 'numeric'})}</TableCell>
              <TableCell className="text-right text-green-600">
                {formatCurrency(month.income)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                {formatCurrency(month.expense)}
              </TableCell>
              <TableCell className={cn("text-right font-medium", month.balance >= 0 ? "text-green-600" : "text-red-600")}>
                {formatCurrency(month.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CashFlowReport;
