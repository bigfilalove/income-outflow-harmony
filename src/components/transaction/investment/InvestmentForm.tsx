
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ProjectAllocation } from '@/types/transaction';

// Import our subcomponents
import InvestmentFormHeader from './InvestmentFormHeader';
import InvestmentDetails from './InvestmentDetails';
import InvestmentFormButton from './InvestmentFormButton';
import InvestmentAllocationToggle from './InvestmentAllocationToggle';
import { useInvestmentFormSubmit } from './useInvestmentFormSubmit';
import { InvestmentFormProps } from './types';

// Import existing components
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import CreatorField from '@/components/transaction/CreatorField';
import CategorySelect from '@/components/transaction/CategorySelect';
import CompanySelect from '@/components/transaction/CompanySelect';
import ProjectAllocations from '@/components/transaction/project-allocation/ProjectAllocations';

const InvestmentForm: React.FC<InvestmentFormProps> = ({ initialValues, onSuccess }) => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [investor, setInvestor] = useState(currentUser?.name || '');
  const [createdBy, setCreatedBy] = useState(currentUser?.name || '');
  const [company, setCompany] = useState('');
  const [hasAllocations, setHasAllocations] = useState(false);
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);

  // Prefill creator field with current user when available
  useEffect(() => {
    if (currentUser?.name) {
      setCreatedBy(currentUser.name);
      setInvestor(currentUser.name);
    }
  }, [currentUser]);

  // Apply initial values if provided
  useEffect(() => {
    if (initialValues) {
      if (initialValues.amount) setAmount(initialValues.amount);
      if (initialValues.description) setDescription(initialValues.description);
      if (initialValues.category) setCategory(initialValues.category);
      if (initialValues.date) setDate(initialValues.date);
      if (initialValues.investor) setInvestor(initialValues.investor);
      if (initialValues.createdBy) setCreatedBy(initialValues.createdBy);
      if (initialValues.company) setCompany(initialValues.company);
      if (initialValues.hasAllocations) setHasAllocations(initialValues.hasAllocations);
      if (initialValues.projectAllocations) setProjectAllocations(initialValues.projectAllocations);
    }
  }, [initialValues]);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date());
    setInvestor(currentUser?.name || '');
    setCreatedBy(currentUser?.name || '');
    setCompany('');
    setHasAllocations(false);
    setProjectAllocations([]);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const { 
    isSubmitting, 
    connectionError, 
    handleSubmit 
  } = useInvestmentFormSubmit(resetForm, currentUser?.name);

  const handleFormSubmit = (e: React.FormEvent) => {
    const formValues = {
      amount,
      description,
      category,
      date,
      investor,
      createdBy,
      company,
      hasAllocations,
      projectAllocations
    };
    
    handleSubmit(e, formValues);
  };

  return (
    <Card className="animate-slideUp">
      <InvestmentFormHeader connectionError={connectionError} />
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-4">
            <InvestmentDetails
              amount={amount}
              description={description}
              investor={investor}
              onAmountChange={setAmount}
              onDescriptionChange={setDescription}
              onInvestorChange={setInvestor}
            />

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

            <div className="space-y-2">
              <CategorySelect
                value={category}
                onChange={setCategory}
                type="investment"
              />
            </div>
            
            <InvestmentAllocationToggle
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
                transactionType="investment"
              />
            )}

            <TransactionDatePicker
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>

          <InvestmentFormButton isSubmitting={isSubmitting} />
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
