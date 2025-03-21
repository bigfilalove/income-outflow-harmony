
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetListFilterProps } from './types';

const BudgetFilters: React.FC<BudgetListFilterProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  selectedType,
  setSelectedType,
  years,
  months,
  quarters,
}) => {
  const handlePeriodChange = (value: string) => {
    const period = value as 'monthly' | 'quarterly' | 'annual';
    setSelectedPeriod(period);
    
    // Reset month/quarter when changing period
    if (period === 'monthly') {
      setSelectedMonth(new Date().getMonth() + 1);
    } else if (period === 'quarterly') {
      setSelectedQuarter(Math.ceil((new Date().getMonth() + 1) / 3));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium">Период</label>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Ежемесячно</SelectItem>
            <SelectItem value="quarterly">Ежеквартально</SelectItem>
            <SelectItem value="annual">Ежегодно</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Год</label>
        <Select 
          value={selectedYear.toString()} 
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите год" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value.toString()}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedPeriod === 'monthly' && (
        <div>
          <label className="text-sm font-medium">Месяц</label>
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите месяц" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedPeriod === 'quarterly' && (
        <div>
          <label className="text-sm font-medium">Квартал</label>
          <Select 
            value={selectedQuarter.toString()} 
            onValueChange={(value) => setSelectedQuarter(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите квартал" />
            </SelectTrigger>
            <SelectContent>
              {quarters.map((quarter) => (
                <SelectItem key={quarter.value} value={quarter.value.toString()}>
                  {quarter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <label className="text-sm font-medium">Тип</label>
        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as 'expense' | 'income')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Расходы</TabsTrigger>
            <TabsTrigger value="income">Доходы</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default BudgetFilters;
