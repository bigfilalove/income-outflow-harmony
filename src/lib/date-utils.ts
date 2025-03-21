
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

// Получить начало месяца
export const getStartOfMonth = (date: Date): Date => {
  return startOfMonth(date);
};

// Получить конец месяца
export const getEndOfMonth = (date: Date): Date => {
  return endOfMonth(date);
};

// Получить следующий месяц
export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

// Получить предыдущий месяц
export const getPreviousMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

// Форматировать дату как месяц и год
export const formatMonthYear = (date: Date): string => {
  return format(date, 'LLLL yyyy', { locale: ru });
};

// Форматировать дату как квартал и год
export const formatQuarterYear = (date: Date): string => {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${quarter} квартал ${date.getFullYear()}`;
};

// Получить текущий квартал (1-4)
export const getCurrentQuarter = (): number => {
  return Math.floor(new Date().getMonth() / 3) + 1;
};

// Получить список месяцев
export const getMonthsList = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: i + 1,
      label: format(date, 'LLLL', { locale: ru })
    };
  });
};

// Получить список кварталов
export const getQuartersList = (): { value: number; label: string }[] => {
  return [
    { value: 1, label: '1 квартал (Янв-Март)' },
    { value: 2, label: '2 квартал (Апр-Июнь)' },
    { value: 3, label: '3 квартал (Июл-Сент)' },
    { value: 4, label: '4 квартал (Окт-Дек)' }
  ];
};

// Получить список последних лет
export const getYearsList = (count: number = 5): { value: number; label: string }[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year,
      label: year.toString()
    };
  });
};
