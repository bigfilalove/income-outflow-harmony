
import { ProjectAllocation } from '@/types/transaction';

export interface ProjectAllocationsProps {
  totalAmount: number;
  allocations: ProjectAllocation[];
  onChange: (allocations: ProjectAllocation[]) => void;
  onToggleAllocations: (enabled: boolean) => void;
}

export interface ProjectAllocationItemProps {
  allocation: ProjectAllocation;
  index: number;
  projects: string[];
  onUpdate: (index: number, field: keyof ProjectAllocation, value: string | number) => void;
  onRemove: (index: number) => void;
  disabled: boolean;
  allocations: ProjectAllocation[];
}

export interface AllocationSummaryProps {
  allocatedTotal: number;
  remainingAmount: number;
  editMode: boolean;
}

export interface AllocationActionsProps {
  remainingAmount: number;
  allocations: ProjectAllocation[];
  projects: string[];
  onChange: (allocations: ProjectAllocation[]) => void;
  addAllocation: () => void;
}
