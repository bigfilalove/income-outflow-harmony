
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetItem from './BudgetItem';
import { BudgetTableProps } from './types';

const BudgetTable: React.FC<BudgetTableProps> = ({ 
  budgets, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAdd
}) => {
  if (isLoading) {
    return <div className="py-10 text-center">Загрузка бюджетов...</div>;
  }

  if (budgets.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Нет бюджетов для выбранного периода</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить бюджет
        </Button>
      </div>
    );
  }

  return (
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
        {budgets.map((budget) => (
          <BudgetItem 
            key={budget.id} 
            budget={budget} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default BudgetTable;
