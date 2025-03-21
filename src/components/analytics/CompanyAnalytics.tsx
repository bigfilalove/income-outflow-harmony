
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { ChartColumnIcon } from 'lucide-react';

interface CompanyTotal {
  company: string;
  income: number;
  expense: number;
  total: number;
}

interface CompanyAnalyticsProps {
  companyTotals: CompanyTotal[];
}

const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ companyTotals }) => {
  if (!companyTotals.length) {
    return (
      <Card className="animate-slideUp col-span-3">
        <CardHeader>
          <CardTitle>Анализ по компаниям</CardTitle>
          <CardDescription>Нет данных по компаниям</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="animate-slideUp col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Анализ по компаниям</CardTitle>
          <CardDescription>Распределение доходов и расходов по компаниям</CardDescription>
        </div>
        <ChartColumnIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Компания</TableHead>
              <TableHead className="text-right">Доходы</TableHead>
              <TableHead className="text-right">Расходы</TableHead>
              <TableHead className="text-right">Баланс</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyTotals.map((company, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{company.company}</TableCell>
                <TableCell className="text-right text-income">
                  {formatCurrency(company.income)}
                </TableCell>
                <TableCell className="text-right text-expense">
                  {formatCurrency(company.expense)}
                </TableCell>
                <TableCell className={`text-right ${company.total >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(company.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompanyAnalytics;
