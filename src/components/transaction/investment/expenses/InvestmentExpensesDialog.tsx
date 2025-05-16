
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
import { Receipt, Plus, FileText } from "lucide-react";
import { formatCurrency } from '@/lib/formatters';
import ExistingExpensesToInvestmentDialog from './ExistingExpensesToInvestmentDialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isExistingExpensesDialogOpen, setIsExistingExpensesDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddSuccess = () => {
    setIsFormOpen(false);
  };

  const handleAddExpense = () => {
    setIsFormOpen(true);
    setIsExistingExpensesDialogOpen(false);
  };

  const handleAddExistingExpenses = () => {
    setIsExistingExpensesDialogOpen(true);
    setIsFormOpen(false);
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
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Button 
                  onClick={handleAddExpense} 
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Новый расход
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleAddExistingExpenses} 
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Из существующих
                </Button>
              </div>
              
              {isFormOpen && (
                <InvestmentExpenseForm 
                  investmentId={investmentId}
                  onSuccess={handleAddSuccess}
                  onCancel={handleFormCancel}
                  isOpen={isFormOpen}
                />
              )}
              
              {isExistingExpensesDialogOpen && (
                <ExistingExpensesToInvestmentDialog
                  isOpen={isExistingExpensesDialogOpen}
                  onClose={() => setIsExistingExpensesDialogOpen(false)}
                  investmentId={investmentId}
                  onSuccess={handleAddSuccess}
                />
              )}
            </div>
            
            <div className={isMobile && (isFormOpen || isExistingExpensesDialogOpen) ? "hidden" : ""}>
              <InvestmentExpensesList investmentId={investmentId} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentExpensesDialog;
