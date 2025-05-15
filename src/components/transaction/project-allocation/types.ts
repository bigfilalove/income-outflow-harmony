
import { TransactionType } from '@/types/transaction';

export interface ProjectAllocation {
  project: string;
  amount: number;
}

export interface ProjectAllocationsProps {
  allocations: ProjectAllocation[];
  totalAmount: number;
  onChange: (allocations: ProjectAllocation[]) => void;
  onToggleAllocations: (enabled: boolean) => void;
  transactionType: 'income' | 'expense'; // Restricting to only income and expense
}

export interface ProjectAllocationItemProps {
  allocation: ProjectAllocation;
  index: number;
  onChange: (index: number, field: keyof ProjectAllocation, value: string | number) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  allocations: ProjectAllocation[];
  projects: string[];
  transactionType: 'income' | 'expense';
}

export interface AllocationSummaryProps {
  allocatedTotal: number;
  remainingAmount: number;
  editMode: boolean;
  transactionType: 'income' | 'expense';
}

export interface AllocationWarningsProps {
  remainingAmount: number;
  totalAmount: number;
  hasDuplicateProjects: boolean;
  transactionType: 'income' | 'expense';
}

export interface AllocationActionsProps {
  remainingAmount: number;
  allocations: ProjectAllocation[];
  projects: string[];
  onChange: (allocations: ProjectAllocation[]) => void;
  addAllocation: () => void;
  transactionType: 'income' | 'expense';
}
