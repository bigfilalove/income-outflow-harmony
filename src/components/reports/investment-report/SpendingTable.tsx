
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from 'lucide-react';
import { CompanySpendingSummary } from './types';
import { formatCurrency } from './utils';

interface SpendingTableProps {
  spendingByCompany: CompanySpendingSummary[];
  toggleSortSpending: () => void;
}

const SpendingTable: React.FC<SpendingTableProps> = ({ 
  spendingByCompany,
  toggleSortSpending
}) => {
  if (spendingByCompany.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">Расходы не найдены за выбранный период</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Компания</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead className="text-right" onClick={toggleSortSpending} style={{ cursor: 'pointer' }}>
              Сумма расходов
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spendingByCompany.flatMap((summary) => {
            const categories = Object.entries(summary.categories);
            return categories.map(([categoryName, amount], idx) => (
              <TableRow key={`${summary.company}-${categoryName}`}>
                {idx === 0 ? (
                  <TableCell rowSpan={categories.length} className="font-medium">
                    {summary.company}
                  </TableCell>
                ) : null}
                <TableCell>{categoryName}</TableCell>
                <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
              </TableRow>
            ));
          })}
          <TableRow>
            <TableCell colSpan={2} className="font-bold text-right">Итого:</TableCell>
            <TableCell className="text-right font-bold">
              {formatCurrency(spendingByCompany.reduce((sum, comp) => sum + comp.totalSpent, 0))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SpendingTable;
