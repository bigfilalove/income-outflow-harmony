
import React from 'react';
import { BudgetPeriod } from '@/types/budget';
import { formatMonthYear } from '@/lib/date-utils';

interface PeriodTitleProps {
  period: BudgetPeriod;
  year: number;
  month: number;
  quarter: number;
}

const PeriodTitle: React.FC<PeriodTitleProps> = ({ period, year, month, quarter }) => {
  const getPeriodTitle = () => {
    if (period === 'monthly') {
      const date = new Date(year, month - 1);
      return formatMonthYear(date);
    } else if (period === 'quarterly') {
      return `${quarter} квартал ${year}`;
    } else {
      return `${year} год`;
    }
  };

  return <span>{getPeriodTitle()}</span>;
};

export default PeriodTitle;
