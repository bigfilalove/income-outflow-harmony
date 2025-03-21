import React, { useState } from 'react';
import { useTransactions } from '@/context/transaction';
import { cn } from '@/lib/utils';  // Add this import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatters';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFileXLSX } from 'xlsx';
import { saveAs } from 'file-saver';

const ProfitLossReport = () => {
  const { transactions } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState<{ month: string; income: number; expense: number; profit: number; }[]>([]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(String);

  const generateReport = () => {
    const monthlyData: { [month: string]: { income: number; expense: number } } = {};

    transactions
      .filter(transaction => new Date(transaction.date).getFullYear().toString() === selectedYear)
      .forEach(transaction => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          monthlyData[month].income += transaction.amount;
        } else {
          monthlyData[month].expense += transaction.amount;
        }
      });

    const report = Object.keys(monthlyData).map(month => ({
      month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
      profit: monthlyData[month].income - monthlyData[month].expense,
    }));

    setReportData(report);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Profit & Loss Report - ${selectedYear}`, 10, 10);

    const headers = [["Month", "Income", "Expense", "Profit"]];
    const data = reportData.map(item => [
      item.month,
      formatCurrency(item.income),
      formatCurrency(item.expense),
      formatCurrency(item.profit)
    ]);

    // @ts-ignore
    doc.autoTable({
      head: headers,
      body: data,
    });

    doc.save(`profit_loss_report_${selectedYear}.pdf`);
  };

  const downloadExcel = () => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(reportData);
    utils.book_append_sheet(wb, ws, "Profit & Loss");
    const wopts = { bookType: 'xlsx', type: 'array' as const };
    const wbout = writeFileXLSX(wb, 'profit_loss_report.xlsx', wopts);

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `profit_loss_report_${selectedYear}.xlsx`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Отчет о прибылях и убытках</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите год" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>Сформировать отчет</Button>
        </div>

        {reportData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Месяц
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Доход
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Расход
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Прибыль
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.income)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.expense)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportData.length > 0 && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={downloadPDF}>
              Скачать PDF
            </Button>
            <Button variant="outline" onClick={downloadExcel}>
              Скачать Excel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitLossReport;
