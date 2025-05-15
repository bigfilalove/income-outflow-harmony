
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ProjectAllocation } from '@/types/transaction';

// Import our components
import TransactionFormHeader from './TransactionFormHeader';
import TransactionFormButton from './TransactionFormButton';
import TransactionDetails from './TransactionDetails';
import TransactionCategoryField from './TransactionCategoryField';
import AllocationToggle from './AllocationToggle';
import { useTransactionFormSubmit } from './useTransactionFormSubmit';

// Import existing components
import TransactionTypeTabs from '@/components/transaction/TransactionTypeTabs';
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import ReimbursementFields from '@/components/transaction/ReimbursementFields';
import CreatorField from '@/components/transaction/CreatorField';
import CompanySelect from '@/components/transaction/CompanySelect';
import ProjectSelect from '@/components/transaction/ProjectSelect';
import ProjectAllocations from '@/components/transaction/project-allocation/ProjectAllocations';

const TransactionForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState(currentUser?.name || '');
  const [createdBy, setCreatedBy] = useState(currentUser?.name || '');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [hasAllocations, setHasAllocations] = useState(false);
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);

  // Prefill creator and reimbursement fields with current user when available
  useEffect(() => {
    if (currentUser?.name) {
      setCreatedBy(currentUser.name);
      setReimbursedTo(currentUser.name);
    }
  }, [currentUser]);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date());
    setIsReimbursement(false);
    setReimbursedTo(currentUser?.name || '');
    setCompany('');
    setProject('');
    setHasAllocations(false);
    setProjectAllocations([]);
  };

  const { 
    isSubmitting, 
    connectionError, 
    handleSubmit 
  } = useTransactionFormSubmit(resetForm, currentUser?.name);

  const handleTransactionTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setIsReimbursement(false); // Reset reimbursement when changing type
  };

  // Define category type
  const categoryType = isReimbursement ? 'reimbursement' : transactionType;

  const handleFormSubmit = (e: React.FormEvent) => {
    const formValues = {
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
      projectAllocations
    };
    
    handleSubmit(e, formValues);
  };

  return (
    <Card className="animate-slideUp">
      <TransactionFormHeader connectionError={connectionError} />
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <TransactionTypeTabs
            value={transactionType}
            onChange={handleTransactionTypeChange}
          />

          <div className="space-y-4">
            <CreatorField
              value={createdBy}
              onChange={setCreatedBy}
            />

            <div className="space-y-2">
              <CompanySelect
                value={company}
                onChange={setCompany}
              />
            </div>

            {!hasAllocations && (
              <ProjectSelect
                value={project}
                onChange={setProject}
              />
            )}

            <TransactionDetails
              amount={amount}
              description={description}
              onAmountChange={setAmount}
              onDescriptionChange={setDescription}
            />

            <TransactionCategoryField
              category={category}
              categoryType={categoryType}
              onCategoryChange={setCategory}
            />

            <AllocationToggle
              hasAllocations={hasAllocations}
              onToggleAllocations={setHasAllocations}
              projectAllocations={projectAllocations}
              amount={amount}
            />

            {amount && hasAllocations && (
              <ProjectAllocations
                totalAmount={parseFloat(amount) || 0}
                allocations={projectAllocations}
                onChange={setProjectAllocations}
                onToggleAllocations={setHasAllocations}
                transactionType={transactionType}
              />
            )}

            {transactionType === 'expense' && (
              <ReimbursementFields
                isReimbursement={isReimbursement}
                onReimbursementChange={setIsReimbursement}
                reimbursedTo={reimbursedTo}
                onReimbursedToChange={setReimbursedTo}
              />
            )}

            <TransactionDatePicker
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>

          <TransactionFormButton
            isSubmitting={isSubmitting}
            isReimbursement={isReimbursement}
            transactionType={transactionType}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
