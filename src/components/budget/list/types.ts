
import { Budget, BudgetPeriod } from '@/types/budget';

export interface BudgetListFilterProps {
  selectedPeriod: BudgetPeriod;
  setSelectedPeriod: (period: BudgetPeriod) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedQuarter: number;
  setSelectedQuarter: (quarter: number) => void;
  selectedType: 'expense' | 'income';
  setSelectedType: (type: 'expense' | 'income') => void;
  years: { value: number; label: string }[];
  months: { value: number; label: string }[];
  quarters: { value: number; label: string }[];
}

export interface BudgetItemProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export interface BudgetTableProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onAdd: () => void;
}

export interface DeleteConfirmDialogProps {
  budget: Budget | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface BudgetDialogProps {
  type: 'add' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
  defaultType?: 'expense' | 'income';
}
