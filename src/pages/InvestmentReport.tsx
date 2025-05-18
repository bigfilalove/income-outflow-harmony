
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvestmentReport from '@/components/reports/investment-report';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InvestmentReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string>('');
  const [investor, setInvestor] = useState<string>('');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Отчет по инвестициям собственников</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Параметры отчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateRange">Период отчета</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateRange"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
              
              <div className="space-y-2">
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  placeholder="Введите для фильтрации по компании"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investor">Инвестор</Label>
                <Input
                  id="investor"
                  placeholder="Введите для фильтрации по инвестору"
                  value={investor}
                  onChange={(e) => setInvestor(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4">
          <InvestmentReport 
            startDate={startDate} 
            endDate={endDate} 
            company={company || undefined}
            investor={investor || undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default InvestmentReportPage;
