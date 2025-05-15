
import { TransactionType } from '@/types/transaction';

export interface ProjectAllocationProps {
  totalAmount: number;
  allocations: Array<{
    project: string;
    amount: number;
  }>;
  onChange: (allocations: Array<{ project: string; amount: number }>) => void;
  onToggleAllocations: (hasAllocations: boolean) => void;
  transactionType: TransactionType;
}
