
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies } from '@/types/transaction';
import { getProjects } from '@/types/transaction';

export type FilterType = 'all' | 'income' | 'expense' | 'transfer' | 'reimbursement' | 'pending' | 'investment' | string;

interface TransactionFilterProps {
  setFilter: (filter: FilterType) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({ setFilter }) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  // Get companies and projects from local storage
  useEffect(() => {
    setCompanies(getCompanies());
    setProjects(getProjects());
    
    // Listen for updates to companies and projects
    const handleCompaniesUpdated = () => {
      setCompanies(getCompanies());
    };
    
    const handleProjectsUpdated = () => {
      setProjects(getProjects());
    };
    
    window.addEventListener('companiesUpdated', handleCompaniesUpdated);
    window.addEventListener('projectsUpdated', handleProjectsUpdated);
    
    return () => {
      window.removeEventListener('companiesUpdated', handleCompaniesUpdated);
      window.removeEventListener('projectsUpdated', handleProjectsUpdated);
    };
  }, []);

  return (
    <Select onValueChange={setFilter} defaultValue="all">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Фильтр" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Тип</SelectLabel>
          <SelectItem value="all">Все транзакции</SelectItem>
          <SelectItem value="income">Доходы</SelectItem>
          <SelectItem value="expense">Расходы</SelectItem>
          <SelectItem value="transfer">Переводы</SelectItem>
          <SelectItem value="reimbursement">Возмещения</SelectItem>
          <SelectItem value="investment">Инвестиции</SelectItem>
          <SelectItem value="pending">Ожидающие возмещения</SelectItem>
        </SelectGroup>
        
        {companies.length > 0 && (
          <SelectGroup>
            <SelectLabel>Компания</SelectLabel>
            {companies.map((company) => (
              <SelectItem key={company} value={`company:${company}`}>
                {company}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {projects.length > 0 && (
          <SelectGroup>
            <SelectLabel>Проект</SelectLabel>
            {projects.map((project) => (
              <SelectItem key={project} value={`project:${project}`}>
                {project}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default TransactionFilter;
