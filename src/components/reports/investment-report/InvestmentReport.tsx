
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/transaction';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { InvestmentReportProps } from './types';
import { processTransactions } from './utils';
import FilterBar from './FilterBar';
import InvestmentsTable from './InvestmentsTable';
import SpendingTable from './SpendingTable';
import ExportButton from './ExportButton';

const InvestmentReport: React.FC<InvestmentReportProps> = ({ 
  startDate, 
  endDate, 
  company: initialCompany,
  investor: initialInvestor 
}) => {
  const { transactions } = useTransactions();
  const [filterCompany, setFilterCompany] = useState(initialCompany || '');
  const [filterInvestor, setFilterInvestor] = useState(initialInvestor || '');
  const [sortByInvestment, setSortByInvestment] = useState<'asc' | 'desc'>('desc');
  const [sortBySpending, setSortBySpending] = useState<'asc' | 'desc'>('desc');
  const isMobile = useIsMobile();
  
  const { investmentsByInvestor, spendingByCompany } = processTransactions(
    transactions,
    startDate,
    endDate,
    filterCompany,
    filterInvestor,
    sortByInvestment,
    sortBySpending
  );
  
  const toggleSortInvestment = () => {
    setSortByInvestment(sortByInvestment === 'asc' ? 'desc' : 'asc');
  };
  
  const toggleSortSpending = () => {
    setSortBySpending(sortBySpending === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <Card className={cn(isMobile && "h-full overflow-auto")}>
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10">
        <div>
          <CardTitle>Отчет по инвестициям собственников</CardTitle>
          {startDate && endDate && (
            <p className="text-muted-foreground">
              Период: {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')}
            </p>
          )}
        </div>
        <ExportButton 
          investmentsByInvestor={investmentsByInvestor}
          spendingByCompany={spendingByCompany}
        />
      </CardHeader>
      <CardContent className={cn(isMobile && "overflow-auto")}>
        <FilterBar
          filterCompany={filterCompany}
          setFilterCompany={setFilterCompany}
          filterInvestor={filterInvestor}
          setFilterInvestor={setFilterInvestor}
        />
        
        <div className="space-y-8">
          <div className={cn(isMobile && "overflow-x-auto")}>
            <h3 className="text-lg font-medium mb-4">Инвестиции по собственникам</h3>
            <InvestmentsTable 
              investmentsByInvestor={investmentsByInvestor}
              toggleSortInvestment={toggleSortInvestment}
            />
          </div>
          
          <div className={cn(isMobile && "overflow-x-auto")}>
            <h3 className="text-lg font-medium mb-4">Расходы по компаниям</h3>
            <SpendingTable 
              spendingByCompany={spendingByCompany}
              toggleSortSpending={toggleSortSpending}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentReport;
