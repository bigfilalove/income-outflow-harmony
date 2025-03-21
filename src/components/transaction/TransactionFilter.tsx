
import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { getCompanies, getProjects } from '@/types/transaction';

export type FilterType = 
  | 'all' 
  | 'income' 
  | 'expense' 
  | 'reimbursement' 
  | 'pending'
  | string; // Для фильтров по компании и проекту (например, "company:ООО Технологии")

interface TransactionFilterProps {
  setFilter: (filter: FilterType) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({ setFilter }) => {
  const { transactions } = useTransactions();
  const [companies, setCompanies] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [value, setValue] = useState<FilterType>('all');
  
  // Получаем уникальные компании из транзакций
  useEffect(() => {
    const uniqueCompanies = new Set<string>();
    const uniqueProjects = new Set<string>();
    
    transactions.forEach(t => {
      if (t.company) uniqueCompanies.add(t.company);
      if (t.project) uniqueProjects.add(t.project);
    });
    
    setCompanies(Array.from(uniqueCompanies).sort());
    setProjects(Array.from(uniqueProjects).sort());
  }, [transactions]);
  
  // Обработчик локального обновления фильтров
  useEffect(() => {
    const handleCompaniesUpdate = () => {
      setCompanies(getCompanies().filter(c => 
        transactions.some(t => t.company === c)
      ));
    };
    
    const handleProjectsUpdate = () => {
      setProjects(getProjects().filter(p => 
        transactions.some(t => t.project === p)
      ));
    };
    
    window.addEventListener('companiesUpdated', handleCompaniesUpdate);
    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('companiesUpdated', handleCompaniesUpdate);
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, [transactions]);
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue as FilterType);
    setFilter(newValue as FilterType);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon className="mr-2 h-4 w-4" />
          Фильтр
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem value="all">Все транзакции</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="income">Доходы</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="expense">Расходы</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="reimbursement">Возмещения</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pending">Ожидающие возмещения</DropdownMenuRadioItem>
          
          {companies.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Компании</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>По компании</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {companies.map(company => (
                    <DropdownMenuRadioItem 
                      key={company} 
                      value={`company:${company}`}
                    >
                      {company}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}
          
          {projects.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Проекты</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>По проекту</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {projects.map(project => (
                    <DropdownMenuRadioItem 
                      key={project} 
                      value={`project:${project}`}
                    >
                      {project}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionFilter;
