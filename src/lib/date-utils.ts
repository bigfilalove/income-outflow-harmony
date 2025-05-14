
import { format, getMonth, getYear, isAfter, isBefore, isSameDay, isSameMonth, parseISO, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'dd.MM.yyyy'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: ru });
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
};

export const getPreviousMonthRange = () => {
  const now = new Date();
  const prevMonth = subMonths(now, 1);
  const startOfMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
  const endOfMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
};

export const isCurrentMonth = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  return isSameMonth(parsedDate, now);
};

export const isPreviousMonth = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const prevMonth = subMonths(now, 1);
  return isSameMonth(parsedDate, prevMonth);
};

export const isInDateRange = (date: Date | string, startDate: Date | null, endDate: Date | null): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!startDate && !endDate) return true;
  
  if (startDate && !endDate) {
    return isAfter(parsedDate, startDate) || isSameDay(parsedDate, startDate);
  }
  
  if (!startDate && endDate) {
    return isBefore(parsedDate, endDate) || isSameDay(parsedDate, endDate);
  }
  
  if (startDate && endDate) {
    return (isAfter(parsedDate, startDate) || isSameDay(parsedDate, startDate)) && 
           (isBefore(parsedDate, endDate) || isSameDay(parsedDate, endDate));
  }
  
  return false;
};

export const getMonthName = (date: Date | string, format: 'long' | 'short' = 'long'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format === 'long' 
    ? parsedDate.toLocaleString('ru', { month: 'long' }) 
    : parsedDate.toLocaleString('ru', { month: 'short' });
};

export const getMonthNameByNumber = (monthNumber: number, format: 'long' | 'short' = 'long'): string => {
  const date = new Date();
  date.setMonth(monthNumber);
  return getMonthName(date, format);
};

export const getCurrentMonthYear = (): { month: number; year: number } => {
  const now = new Date();
  return {
    month: getMonth(now),
    year: getYear(now)
  };
};

// Added missing functions

// Get short month name for charts
export const getMonthNameShort = (monthIndex: number): string => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('ru', { month: 'short' });
};

// Format month and year for display
export const formatMonthYear = (date: Date): string => {
  return format(date, 'LLLL yyyy', { locale: ru });
};

// Get start and end of month helpers
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// List generators for dropdowns
export const getMonthsList = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthNameByNumber(i, 'long')
  }));
};

export const getQuartersList = (): { value: number; label: string }[] => {
  return [
    { value: 1, label: "1 квартал" },
    { value: 2, label: "2 квартал" },
    { value: 3, label: "3 квартал" },
    { value: 4, label: "4 квартал" }
  ];
};

export const getYearsList = (): { value: number; label: string }[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return { value: year, label: year.toString() };
  });
};
