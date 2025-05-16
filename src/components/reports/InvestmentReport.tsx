
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/transaction';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface InvestmentReportProps {
  startDate?: Date;
  endDate?: Date;
  company?: string;
  investor?: string;
}

interface InvestmentSummary {
  investor: string;
  totalInvested: number;
  companies: {
    [company: string]: number;
  };
}

interface CompanySpendingSummary {
  company: string;
  totalSpent: number;
  categories: {
    [category: string]: number;
  };
}

const InvestmentReport: React.FC<InvestmentReportProps> = ({ 
  startDate, 
  endDate, 
  company: initialCompany,
  investor: initialInvestor 
}) => {
  const { transactions } = useTransactions();
  const [investmentsByInvestor, setInvestmentsByInvestor] = useState<InvestmentSummary[]>([]);
  const [spendingByCompany, setSpendingByCompany] = useState<CompanySpendingSummary[]>([]);
  const [filterCompany, setFilterCompany] = useState(initialCompany || '');
  const [filterInvestor, setFilterInvestor] = useState(initialInvestor || '');
  const [sortByInvestment, setSortByInvestment] = useState<'asc' | 'desc'>('desc');
  const [sortBySpending, setSortBySpending] = useState<'asc' | 'desc'>('desc');
  const isMobile = useIsMobile();
  
  // Process transactions to calculate investment summaries
  useEffect(() => {
    // Filter transactions based on date range and other filters
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      const dateInRange = (!startDate || transactionDate >= startDate) && 
                          (!endDate || transactionDate <= endDate);
      
      const matchesCompanyFilter = !filterCompany || transaction.company === filterCompany;
      const matchesInvestorFilter = !filterInvestor || 
                                   (transaction.isInvestment && transaction.investor === filterInvestor) ||
                                   (transaction.category === 'Вклад собственника' && transaction.description.includes(filterInvestor));
      
      // Включаем все транзакции с isInvestment=true, а также транзакции с категорией "Вклад собственника"
      const isInvestmentTransaction = transaction.isInvestment || 
                                     transaction.category === 'Вклад собственника' ||
                                     transaction.category === 'Инвестиции партнера';
      
      return dateInRange && matchesCompanyFilter && isInvestmentTransaction && 
            (matchesInvestorFilter || !filterInvestor);
    });
    
    console.log("Filtered transactions for investment report:", filteredTransactions);
    
    // Calculate investments by investor
    const investmentMap: Record<string, InvestmentSummary> = {};
    
    filteredTransactions.forEach(transaction => {
      // Определяем инвестора - используем поле investor или извлекаем из description для "Вклад собственника"
      let investor = transaction.investor || '';
      
      if (!investor && transaction.category === 'Вклад собственника') {
        // Пытаемся извлечь имя инвестора из описания
        investor = transaction.description.split(' от ')[1] || 'Неизвестный инвестор';
      }
      
      if (investor && transaction.company) {
        if (!investmentMap[investor]) {
          investmentMap[investor] = {
            investor,
            totalInvested: 0,
            companies: {}
          };
        }
        
        investmentMap[investor].totalInvested += transaction.amount;
        
        const company = transaction.company;
        if (!investmentMap[investor].companies[company]) {
          investmentMap[investor].companies[company] = 0;
        }
        
        investmentMap[investor].companies[company] += transaction.amount;
      }
    });
    
    // Convert to array and sort
    const investmentArray = Object.values(investmentMap).sort((a, b) => {
      return sortByInvestment === 'desc' 
        ? b.totalInvested - a.totalInvested 
        : a.totalInvested - b.totalInvested;
    });
    
    setInvestmentsByInvestor(investmentArray);
    
    // Calculate spending by company
    const spendingMap: Record<string, CompanySpendingSummary> = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense' && transaction.company) {
        const company = transaction.company;
        
        if (!spendingMap[company]) {
          spendingMap[company] = {
            company,
            totalSpent: 0,
            categories: {}
          };
        }
        
        spendingMap[company].totalSpent += transaction.amount;
        
        const category = transaction.category;
        if (!spendingMap[company].categories[category]) {
          spendingMap[company].categories[category] = 0;
        }
        
        spendingMap[company].categories[category] += transaction.amount;
      }
    });
    
    // Convert to array and sort
    const spendingArray = Object.values(spendingMap).sort((a, b) => {
      return sortBySpending === 'desc' 
        ? b.totalSpent - a.totalSpent 
        : a.totalSpent - b.totalSpent;
    });
    
    setSpendingByCompany(spendingArray);
    
  }, [transactions, startDate, endDate, filterCompany, filterInvestor, sortByInvestment, sortBySpending]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };
  
  const toggleSortInvestment = () => {
    setSortByInvestment(sortByInvestment === 'asc' ? 'desc' : 'asc');
  };
  
  const toggleSortSpending = () => {
    setSortBySpending(sortBySpending === 'asc' ? 'desc' : 'asc');
  };
  
  const handleExportToExcel = () => {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Create investments sheet
    const investmentsData = investmentsByInvestor.flatMap(summary => {
      const baseRow = {
        'Инвестор': summary.investor,
        'Общая сумма': summary.totalInvested
      };
      
      return Object.entries(summary.companies).map(([company, amount]) => ({
        ...baseRow,
        'Компания': company,
        'Сумма инвестиций': amount
      }));
    });
    
    // Create spending sheet
    const spendingData = spendingByCompany.flatMap(summary => {
      const baseRow = {
        'Компания': summary.company,
        'Общие расходы': summary.totalSpent
      };
      
      return Object.entries(summary.categories).map(([category, amount]) => ({
        ...baseRow,
        'Категория': category,
        'Сумма расходов': amount
      }));
    });
    
    // Add sheets to workbook
    const investmentsSheet = XLSX.utils.json_to_sheet(investmentsData);
    XLSX.utils.book_append_sheet(wb, investmentsSheet, "Инвестиции");
    
    const spendingSheet = XLSX.utils.json_to_sheet(spendingData);
    XLSX.utils.book_append_sheet(wb, spendingSheet, "Расходы");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save file
    const fileName = `Отчет_по_инвестициям_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    saveAs(blob, fileName);
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
        <Button variant="outline" size="sm" onClick={handleExportToExcel}>
          <Download className="mr-2 h-4 w-4" />
          Экспорт в Excel
        </Button>
      </CardHeader>
      <CardContent className={cn(isMobile && "overflow-auto")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="filterCompany">Фильтр по компании</Label>
            <Input
              id="filterCompany"
              placeholder="Введите название компании"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterInvestor">Фильтр по инвестору</Label>
            <Input
              id="filterInvestor"
              placeholder="Введите имя инвестора"
              value={filterInvestor}
              onChange={(e) => setFilterInvestor(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-8">
          <div className={cn(isMobile && "overflow-x-auto")}>
            <h3 className="text-lg font-medium mb-4">Инвестиции по собственникам</h3>
            {investmentsByInvestor.length > 0 ? (
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
            ) : (
              <p className="text-center text-muted-foreground py-4">Инвестиции не найдены за выбранный период</p>
            )}
          </div>
          
          <div className={cn(isMobile && "overflow-x-auto")}>
            <h3 className="text-lg font-medium mb-4">Расходы по компаниям</h3>
            {spendingByCompany.length > 0 ? (
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
            ) : (
              <p className="text-center text-muted-foreground py-4">Расходы не найдены за выбранный период</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentReport;
