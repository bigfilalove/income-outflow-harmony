
import { ProjectAllocation } from '@/types/transaction';

export interface ProjectAllocationProps {
  project: string;
  amount: number;
  onProjectChange: (project: string) => void;
  onAmountChange: (amount: number) => void;
  onDelete: () => void;
}

export interface ProjectAllocationsProps {
  allocations: ProjectAllocation[];
  transactionAmount: number;
  onAllocationsChange: (allocations: ProjectAllocation[]) => void;
  transactionType?: 'income' | 'expense';
}

export interface AllocationSummaryProps {
  allocations: ProjectAllocation[];
  transactionAmount: number;
  transactionType?: 'income' | 'expense';
}

export interface AllocationWarningsProps {
  allocations: ProjectAllocation[];
  transactionAmount: number;
  transactionType?: 'income' | 'expense';
}

export interface AllocationActionsProps {
  allocations: ProjectAllocation[];
  transactionAmount: number;
  onAllocationsChange: (allocations: ProjectAllocation[]) => void;
  transactionType?: 'income' | 'expense';
}

export interface ProjectAllocationItemProps {
  allocation: ProjectAllocation;
  onUpdate: (updated: ProjectAllocation) => void;
  onDelete: () => void;
}
