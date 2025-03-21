
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { TransactionType, Transaction } from '@/types/transaction';
import { useTransactions } from '@/context/TransactionContext';
import TransactionTypeTabs from './TransactionTypeTabs';
import TransactionDatePicker from './TransactionDatePicker';
import ReimbursementFields from './ReimbursementFields';
import CreatorField from './CreatorField';
import CategorySelect from './CategorySelect';
import CompanySelect from './CompanySelect';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load transaction data when dialog opens
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
    
    setIsSubmitting(true);
    
    const updatedTransaction: Transaction = {
      ...transaction,
      amount: parseFloat(amount),
      description,
      category,
      date,
      type: transactionType,
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
    };
    
    // Add reimbursement fields if it's a reimbursement
    if (transactionType === 'expense' && isReimbursement) {
      updatedTransaction.isReimbursement = true;
      updatedTransaction.reimbursedTo = reimbursedTo;
      // Keep the same status unless it's a new reimbursement
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <TransactionTypeTabs 
            value={transactionType}
            onChange={handleTransactionTypeChange}
          />
          
          <div className="space-y-3">
            <CreatorField 
              value={createdBy}
              onChange={setCreatedBy}
            />

            <CompanySelect
              value={company}
              onChange={setCompany}
            />

            <div className="space-y-1">
              <Label htmlFor="amount">Сумма</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Описание транзакции"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <CategorySelect 
              categories={transactionType === 'income' ? [] : []}
              value={category}
              onChange={setCategory}
            />
            
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
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
