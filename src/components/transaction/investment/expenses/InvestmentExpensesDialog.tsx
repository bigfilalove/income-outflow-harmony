
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvestmentExpenseForm, InvestmentExpensesList } from './index';
import { Receipt } from "lucide-react"; // Added missing import
import { formatCurrency } from '@/lib/formatters';

interface InvestmentExpensesDialogProps {
  investmentId: string;
  investmentAmount: number;
  investmentDescription: string;
}

const InvestmentExpensesDialog: React.FC<InvestmentExpensesDialogProps> = ({
  investmentId,
  investmentAmount,
  investmentDescription
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddSuccess = () => {
    setIsFormOpen(false);
  };

  const handleAddExpense = () => {
    setIsFormOpen(true);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleOpenDialog = () => {
    console.log('Открываем диалог для инвестиции:', investmentId);
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenDialog}
        title="Управление расходами"
      >
        <Receipt className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Расходы по инвестиции</DialogTitle>
            <DialogDescription>
              Инвестиция: {investmentDescription} ({formatCurrency(investmentAmount)})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Button 
                onClick={handleAddExpense} 
                className="w-full mb-4"
              >
                Добавить новый расход
              </Button>
              
              {isFormOpen && (
                <InvestmentExpenseForm 
                  investmentId={investmentId}
                  onSuccess={handleAddSuccess}
                  onCancel={handleFormCancel}
                  isOpen={isFormOpen}
                />
              )}
            </div>
            
            <div>
              <InvestmentExpensesList investmentId={investmentId} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentExpensesDialog;
