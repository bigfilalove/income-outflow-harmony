
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InvestmentExpenseForm from './InvestmentExpenseForm';
import InvestmentExpensesList from './InvestmentExpensesList';
import { Receipt } from "lucide-react";
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Receipt className="h-4 w-4" />
          <span>Управление расходами</span>
        </Button>
      </DialogTrigger>
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
  );
};

export default InvestmentExpensesDialog;
