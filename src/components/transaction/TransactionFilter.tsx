
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterType = 'all' | 'income' | 'expense' | 'reimbursement' | 'pending';

interface TransactionFilterProps {
  setFilter: (filter: FilterType) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({ setFilter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setFilter('all')}>
          Все транзакции
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('income')}>
          Только доходы
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('expense')}>
          Только расходы
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('reimbursement')}>
          Только возмещения
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('pending')}>
          Ожидающие возмещения
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionFilter;
