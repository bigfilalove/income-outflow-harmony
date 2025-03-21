
import React, { useState } from 'react';
import { useBudgets } from '@/context/BudgetContext';
import { Budget, BudgetPeriod } from '@/types/budget';
import { getMonthsList, getQuartersList, getYearsList } from '@/lib/date-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetFilters from './list/BudgetFilters';
import BudgetTable from './list/BudgetTable';
import DeleteConfirmDialog from './list/DeleteConfirmDialog';
import BudgetDialog from './list/BudgetDialog';
import PeriodTitle from './list/PeriodTitle';

const BudgetList: React.FC = () => {
  const { budgets, deleteBudget, isLoading } = useBudgets();
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.ceil((new Date().getMonth() + 1) / 3));

  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmBudget, setDeleteConfirmBudget] = useState<Budget | null>(null);
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  const years = getYearsList();
  const months = getMonthsList();
  const quarters = getQuartersList();

  // Filter budgets based on selected criteria
  const filteredBudgets = budgets.filter(budget => 
    budget.period === selectedPeriod && 
    budget.year === selectedYear && 
    (selectedPeriod === 'monthly' ? budget.month === selectedMonth : 
     selectedPeriod === 'quarterly' ? budget.month === selectedQuarter : 
     budget.month === 1) &&
    budget.type === selectedType
  );

  const handleEditClick = (budget: Budget) => {
    setEditBudget(budget);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (budget: Budget) => {
    setDeleteConfirmBudget(budget);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmBudget) {
      await deleteBudget(deleteConfirmBudget.id);
      setDeleteConfirmBudget(null);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditBudget(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Бюджеты</CardTitle>
            <CardDescription>
              <PeriodTitle 
                period={selectedPeriod} 
                year={selectedYear} 
                month={selectedMonth} 
                quarter={selectedQuarter} 
              />
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить бюджет
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <BudgetFilters
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedQuarter={selectedQuarter}
              setSelectedQuarter={setSelectedQuarter}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              years={years}
              months={months}
              quarters={quarters}
            />
            
            <BudgetTable
              budgets={filteredBudgets}
              isLoading={isLoading}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onAdd={() => setIsAddDialogOpen(true)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <BudgetDialog 
        type="edit"
        isOpen={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        budget={editBudget}
      />
      
      <BudgetDialog
        type="add"
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        defaultType={selectedType}
      />
      
      <DeleteConfirmDialog
        budget={deleteConfirmBudget}
        onClose={() => setDeleteConfirmBudget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default BudgetList;
