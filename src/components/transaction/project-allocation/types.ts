
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
  transactionType?: TransactionType; // Updated to accept TransactionType
}

export interface ProjectAllocationItemProps {
  allocation: ProjectAllocation;
  index: number;
  projects: string[];
  onUpdate: (index: number, field: keyof ProjectAllocation, value: string | number) => void; // Added the missing onUpdate
  onRemove: (index: number) => void;
  disabled?: boolean;
  allocations: ProjectAllocation[];
  transactionType?: TransactionType; // Updated to accept TransactionType
}

export interface AllocationSummaryProps {
  allocatedTotal: number;
  remainingAmount: number;
  editMode: boolean;
  transactionType?: TransactionType; // Updated to accept TransactionType
}

export interface AllocationWarningsProps {
  remainingAmount: number;
  totalAmount: number;
  hasDuplicateProjects: boolean;
  transactionType?: TransactionType; // Updated to accept TransactionType
}

export interface AllocationActionsProps {
  remainingAmount: number;
  allocations: ProjectAllocation[];
  projects: string[];
  onChange: (allocations: ProjectAllocation[]) => void;
  addAllocation: () => void;
  transactionType?: TransactionType; // Updated to accept TransactionType
}
