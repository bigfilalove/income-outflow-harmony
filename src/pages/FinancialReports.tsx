
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { useTransactions } from '@/context/transaction';
import ProfitLossReport from '@/components/reports/ProfitLossReport';
import BalanceSheetReport from '@/components/reports/BalanceSheetReport';
import CashFlowReport from '@/components/reports/CashFlowReport';
import { generateFinancialReport } from '@/utils/financialReportUtils';

const FinancialReports = () => {
  const { transactions } = useTransactions();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profit-loss');
  
  const handleExport = (format: 'pdf' | 'excel') => {
    if (!startDate || !endDate) return;
    
    generateFinancialReport({
      reportType: activeTab as 'profit-loss' | 'balance-sheet' | 'cash-flow',
      format,
      startDate,
      endDate,
      transactions
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Финансовые отчеты</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Стандартные финансовые отчеты</CardTitle>
            <CardDescription>Отчеты о прибылях и убытках, балансовые отчеты, отчеты о движении денежных средств</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[300px]",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate ? (
                      <>
                        {format(startDate, 'dd.MM.yyyy', { locale: ru })} - {format(endDate, 'dd.MM.yyyy', { locale: ru })}
                      </>
                    ) : (
                      <span>Выберите период</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={startDate}
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from);
                      setEndDate(range?.to);
                      if (range?.to) {
                        setIsCalendarOpen(false);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт в Excel
              </Button>
              <Button variant="default" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт в PDF
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profit-loss">Прибыли и убытки</TabsTrigger>
                <TabsTrigger value="balance-sheet">Баланс</TabsTrigger>
                <TabsTrigger value="cash-flow">Движение денежных средств</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profit-loss" className="mt-4">
                <ProfitLossReport startDate={startDate} endDate={endDate} />
              </TabsContent>
              
              <TabsContent value="balance-sheet" className="mt-4">
                <BalanceSheetReport startDate={startDate} endDate={endDate} />
              </TabsContent>
              
              <TabsContent value="cash-flow" className="mt-4">
                <CashFlowReport startDate={startDate} endDate={endDate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FinancialReports;
