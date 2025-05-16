
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Coins } from 'lucide-react';
import InvestmentReport from './investment-report';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvestmentReportDialogProps {
  className?: string;
}

const InvestmentReportDialog: React.FC<InvestmentReportDialogProps> = ({ className }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string>('');
  const [investor, setInvestor] = useState<string>('');
  const isMobile = useIsMobile();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Coins className="h-4 w-4 mr-2" />
          Отчет по инвестициям
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-[800px]", isMobile && "h-[90vh] flex flex-col")}>
        <DialogHeader>
          <DialogTitle>Отчет по инвестициям собственников</DialogTitle>
        </DialogHeader>
        
        <div className={cn("flex flex-col gap-4", isMobile && "flex-1 overflow-hidden")}>
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
          
          <div className={cn("mt-4", isMobile && "flex-1 overflow-auto")}>
            <InvestmentReport 
              startDate={startDate} 
              endDate={endDate} 
              company={company || undefined}
              investor={investor || undefined}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentReportDialog;
