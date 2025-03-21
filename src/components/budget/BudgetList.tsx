
import React, { useState } from 'react';
import { useBudgets } from '@/context/BudgetContext';
import { Budget, BudgetPeriod } from '@/types/budget';
import { formatCurrency } from '@/lib/formatters';
import { 
  formatMonthYear, 
  formatQuarterYear, 
  getMonthsList,
  getQuartersList,
  getYearsList
} from '@/lib/date-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import BudgetForm from './BudgetForm';

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

  // Фильтрация бюджетов по выбранному периоду, году, месяцу/кварталу и типу
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

  const handlePeriodChange = (value: string) => {
    const period = value as BudgetPeriod;
    setSelectedPeriod(period);
    
    // Сбрасываем месяц/квартал при смене периода
    if (period === 'monthly') {
      setSelectedMonth(new Date().getMonth() + 1);
    } else if (period === 'quarterly') {
      setSelectedQuarter(Math.ceil((new Date().getMonth() + 1) / 3));
    }
  };

  // Получаем название текущего периода
  const getPeriodTitle = () => {
    if (selectedPeriod === 'monthly') {
      const date = new Date(selectedYear, selectedMonth - 1);
      return formatMonthYear(date);
    } else if (selectedPeriod === 'quarterly') {
      return `${selectedQuarter} квартал ${selectedYear}`;
    } else {
      return `${selectedYear} год`;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Бюджеты</CardTitle>
            <CardDescription>
              {getPeriodTitle()}
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить бюджет
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Период</label>
                <Select 
                  value={selectedPeriod} 
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Ежемесячно</SelectItem>
                    <SelectItem value="quarterly">Ежеквартально</SelectItem>
                    <SelectItem value="annual">Ежегодно</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Год</label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите год" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value.toString()}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPeriod === 'monthly' && (
                <div>
                  <label className="text-sm font-medium">Месяц</label>
                  <Select 
                    value={selectedMonth.toString()} 
                    onValueChange={(value) => setSelectedMonth(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите месяц" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedPeriod === 'quarterly' && (
                <div>
                  <label className="text-sm font-medium">Квартал</label>
                  <Select 
                    value={selectedQuarter.toString()} 
                    onValueChange={(value) => setSelectedQuarter(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите квартал" />
                    </SelectTrigger>
                    <SelectContent>
                      {quarters.map((quarter) => (
                        <SelectItem key={quarter.value} value={quarter.value.toString()}>
                          {quarter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Тип</label>
                <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as 'expense' | 'income')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expense">Расходы</TabsTrigger>
                    <TabsTrigger value="income">Доходы</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-10 text-center">Загрузка бюджетов...</div>
            ) : filteredBudgets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Категория</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.category}</TableCell>
                      <TableCell>{budget.company || 'Все компании'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(budget.amount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(budget)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(budget)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Нет бюджетов для выбранного периода</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить бюджет
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Диалог редактирования бюджета */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать бюджет</DialogTitle>
          </DialogHeader>
          {editBudget && (
            <BudgetForm 
              initialData={editBudget} 
              onSuccess={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Диалог добавления бюджета */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить бюджет</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onSuccess={() => setIsAddDialogOpen(false)}
            defaultType={selectedType}
          />
        </DialogContent>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={!!deleteConfirmBudget} onOpenChange={() => setDeleteConfirmBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Бюджет для категории 
              "{deleteConfirmBudget?.category}" будет удален.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetList;
