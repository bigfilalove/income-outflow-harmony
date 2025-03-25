
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCompanies } from '@/lib/companies';

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
  // Загружаем компании через API
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  if (isLoading) {
    return <div>Загрузка компаний...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки компаний: {error.message}</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите компанию" />
      </SelectTrigger>
      <SelectContent>
        {companies && companies.map((company) => (
          <SelectItem key={company.id} value={company.name}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySelect;
