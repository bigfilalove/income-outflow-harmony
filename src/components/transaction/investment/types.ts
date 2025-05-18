
import { ProjectAllocation } from '@/types/transaction';

export interface InvestmentFormProps {
  initialValues?: InvestmentFormValues;
  onSuccess?: () => void;
}

export interface InvestmentFormValues {
  amount: string;
  description: string;
  category: string;
  date: Date;
  investor: string;
  createdBy: string;
  company: string;
  hasAllocations: boolean;
  projectAllocations: ProjectAllocation[];
}
