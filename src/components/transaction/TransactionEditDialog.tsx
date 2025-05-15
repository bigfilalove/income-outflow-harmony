
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction, TransactionType, ProjectAllocation } from '@/types/transaction';
import { useTransactions } from '@/context/transaction';
import { useIsMobile } from '@/hooks/use-mobile';
import TransactionEditForm from './edit-dialog/TransactionEditForm';
import { useTransactionFormValidator } from './edit-dialog/useTransactionFormValidator';

interface TransactionEditDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionEditDialog: React.FC<TransactionEditDialogProps> = ({ 
  transaction, 
  isOpen, 
  onClose 
}) => {
  const { updateTransaction } = useTransactions();
  const isMobile = useIsMobile();
  
  const [transactionType, setTransactionType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [hasAllocations, setHasAllocations] = useState(false);
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our custom hook for form validation
  const { validateForm } = useTransactionFormValidator(
    hasAllocations,
    projectAllocations,
    amount
  );
  
  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.type as TransactionType);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategory(transaction.category);
      setDate(new Date(transaction.date));
      setIsReimbursement(transaction.isReimbursement || false);
      setReimbursedTo(transaction.reimbursedTo || '');
      setCreatedBy(transaction.createdBy || '');
      setCompany(transaction.company || '');
      setProject(transaction.project || '');
      setHasAllocations(transaction.hasAllocations || false);
      setProjectAllocations(transaction.projectAllocations || []);
    }
  }, [transaction]);
  
  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    if (type !== 'expense') {
      setIsReimbursement(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction) return;
    
    // Validate form
    if (!validateForm()) return;
    
    const numAmount = parseFloat(amount);
    
    setIsSubmitting(true);
    
    const updatedTransaction: Transaction = {
      ...transaction,
      amount: numAmount,
      description,
      category,
      date,
      type: transactionType,
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
      project: hasAllocations ? undefined : (project || undefined),
      hasAllocations,
      projectAllocations: hasAllocations ? projectAllocations : undefined
    };
    
    if (transactionType === 'expense' && isReimbursement) {
      updatedTransaction.isReimbursement = true;
      updatedTransaction.reimbursedTo = reimbursedTo;
      if (!transaction.isReimbursement) {
        updatedTransaction.reimbursementStatus = 'pending';
      }
    } else {
      updatedTransaction.isReimbursement = false;
      updatedTransaction.reimbursedTo = undefined;
      updatedTransaction.reimbursementStatus = undefined;
    }
    
    try {
      await updateTransaction(updatedTransaction);
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-h-[90vh] overflow-y-auto p-4' : 'sm:max-w-md max-h-[80vh] overflow-y-auto'}`}>
        <DialogHeader>
          <DialogTitle>Редактировать транзакцию</DialogTitle>
        </DialogHeader>
        
        <TransactionEditForm
          transaction={transaction}
          transactionType={transactionType}
          amount={amount}
          description={description}
          category={category}
          date={date}
          isReimbursement={isReimbursement}
          reimbursedTo={reimbursedTo}
          createdBy={createdBy}
          company={company}
          project={project}
          hasAllocations={hasAllocations}
          projectAllocations={projectAllocations}
          isSubmitting={isSubmitting}
          
          onTransactionTypeChange={handleTransactionTypeChange}
          onAmountChange={setAmount}
          onDescriptionChange={setDescription}
          onCategoryChange={setCategory}
          onDateChange={setDate}
          onReimbursementChange={setIsReimbursement}
          onReimbursedToChange={setReimbursedTo}
          onCreatedByChange={setCreatedBy}
          onCompanyChange={setCompany}
          onProjectChange={setProject}
          onHasAllocationsChange={setHasAllocations}
          onProjectAllocationsChange={setProjectAllocations}
          
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
