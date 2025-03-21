
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { getCompanies } from '@/types/transaction';

export type FilterType = 'all' | 'income' | 'expense' | 'reimbursement' | 'pending' | string;

interface TransactionFilterProps {
  setFilter: (filter: FilterType) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({ setFilter }) => {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    // Загружаем актуальный список компаний
    setCompanies(getCompanies());
    
    // Обновляем список при изменении в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companies') {
        setCompanies(getCompanies());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <span>Фильтр</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
          Возмещения расходов
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('pending')}>
          Ожидающие возмещения
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-xs text-muted-foreground">Компании</div>
        
        {companies.map(company => (
          <DropdownMenuItem key={company} onClick={() => setFilter(`company:${company}`)}>
            {company}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionFilter;
