
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Transaction, TransactionType, CategoryType, ProjectAllocation } from '@/types/transaction';
import TransactionTypeTabs from '../TransactionTypeTabs';
import TransactionDatePicker from '../TransactionDatePicker';
import ReimbursementFields from '../ReimbursementFields';
import CreatorField from '../CreatorField';
import CategorySelect from '../CategorySelect';
import CompanySelect from '../CompanySelect';
import ProjectSelect from '../ProjectSelect';
import ProjectAllocations from '../ProjectAllocations';
import TransactionAmountField from './TransactionAmountField';
import TransactionDescriptionField from './TransactionDescriptionField';

interface TransactionEditFormProps {
  transaction: Transaction | null;
  transactionType: TransactionType;
  amount: string;
  description: string;
  category: string;
  date: Date;
  isReimbursement: boolean;
  reimbursedTo: string;
  createdBy: string;
  company: string;
  project: string;
  hasAllocations: boolean;
  projectAllocations: ProjectAllocation[];
  isSubmitting: boolean;
  
  onTransactionTypeChange: (type: TransactionType) => void;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (newDate: Date | null) => void;
  onReimbursementChange: (value: boolean) => void;
  onReimbursedToChange: (value: string) => void;
  onCreatedByChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onHasAllocationsChange: (value: boolean) => void;
  onProjectAllocationsChange: (allocations: ProjectAllocation[]) => void;
  
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const TransactionEditForm: React.FC<TransactionEditFormProps> = ({
  transaction,
  transactionType,
  amount,
  description,
  category,
  date,
  isReimbursement,
  reimbursedTo,
  createdBy,
  company,
  project,
  hasAllocations,
  projectAllocations,
  isSubmitting,
  
  onTransactionTypeChange,
  onAmountChange,
  onDescriptionChange,
  onCategoryChange,
  onDateChange,
  onReimbursementChange,
  onReimbursedToChange,
  onCreatedByChange,
  onCompanyChange,
  onProjectChange,
  onHasAllocationsChange,
  onProjectAllocationsChange,
  
  onSubmit,
  onClose
}) => {
  const categoryType: CategoryType = isReimbursement ? 'reimbursement' : transactionType;
  
  // For project allocations, ensure we pass only 'income' or 'expense' type
  const allocationTransactionType = transactionType === 'transfer' ? 'expense' : transactionType;
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <TransactionTypeTabs 
        value={transactionType}
        onChange={onTransactionTypeChange}
      />
      
      <div className="space-y-3">
        <CreatorField 
          value={createdBy}
          onChange={onCreatedByChange}
        />

        <CompanySelect
          value={company}
          onChange={onCompanyChange}
        />

        {!hasAllocations && (
          <ProjectSelect
            value={project}
            onChange={onProjectChange}
          />
        )}

        <TransactionAmountField
          amount={amount}
          onChange={onAmountChange}
        />
        
        <TransactionDescriptionField
          description={description}
          onChange={onDescriptionChange}
        />
        
        <CategorySelect 
          value={category}
          onChange={onCategoryChange}
          type={categoryType}
        />
        
        {transactionType === 'expense' && (
          <ReimbursementFields 
            isReimbursement={isReimbursement}
            onReimbursementChange={onReimbursementChange}
            reimbursedTo={reimbursedTo}
            onReimbursedToChange={onReimbursedToChange}
          />
        )}
        
        {amount && (
          <ProjectAllocations
            totalAmount={parseFloat(amount) || 0}
            allocations={projectAllocations}
            onChange={onProjectAllocationsChange}
            onToggleAllocations={onHasAllocationsChange}
            transactionType={allocationTransactionType}
          />
        )}
        
        <TransactionDatePicker 
          date={date}
          onDateChange={(newDate) => newDate && onDateChange(newDate)}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2 sticky bottom-0 bg-background">
        <Button variant="outline" type="button" onClick={onClose}>
          Отмена
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </div>
    </form>
  );
};

export default TransactionEditForm;
