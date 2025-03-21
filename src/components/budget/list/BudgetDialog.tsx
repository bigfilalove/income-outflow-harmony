
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BudgetForm from '@/components/budget/BudgetForm';
import { BudgetDialogProps } from './types';

const BudgetDialog: React.FC<BudgetDialogProps> = ({ 
  type, 
  isOpen, 
  onClose, 
  budget, 
  defaultType 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Добавить бюджет' : 'Редактировать бюджет'}
          </DialogTitle>
        </DialogHeader>
        <BudgetForm
          initialData={type === 'edit' ? budget || undefined : undefined}
          onSuccess={onClose}
          defaultType={defaultType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
