
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { BudgetItemProps } from './types';

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{budget.category}</TableCell>
      <TableCell>{budget.company || 'Все компании'}</TableCell>
      <TableCell className="text-right">{formatCurrency(budget.amount)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(budget)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default BudgetItem;
