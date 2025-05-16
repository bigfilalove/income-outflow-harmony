
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
import { InvestmentSummary } from './types';
import { formatCurrency } from './utils';

interface InvestmentsTableProps {
  investmentsByInvestor: InvestmentSummary[];
  toggleSortInvestment: () => void;
}

const InvestmentsTable: React.FC<InvestmentsTableProps> = ({ 
  investmentsByInvestor,
  toggleSortInvestment
}) => {
  if (investmentsByInvestor.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">Инвестиции не найдены за выбранный период</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Инвестор</TableHead>
            <TableHead>Компания</TableHead>
            <TableHead className="text-right" onClick={toggleSortInvestment} style={{ cursor: 'pointer' }}>
              Сумма инвестиций
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investmentsByInvestor.flatMap((summary) => {
            const companies = Object.entries(summary.companies);
            return companies.map(([companyName, amount], idx) => (
              <TableRow key={`${summary.investor}-${companyName}`}>
                {idx === 0 ? (
                  <TableCell rowSpan={companies.length} className="font-medium">
                    {summary.investor}
                  </TableCell>
                ) : null}
                <TableCell>{companyName}</TableCell>
                <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
              </TableRow>
            ));
          })}
          <TableRow>
            <TableCell colSpan={2} className="font-bold text-right">Итого:</TableCell>
            <TableCell className="text-right font-bold">
              {formatCurrency(investmentsByInvestor.reduce((sum, inv) => sum + inv.totalInvested, 0))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentsTable;
