
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCompaniesFromSupabase } from '@/services/api/supabase/companies';

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
  // Load companies from Supabase instead of the API
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompaniesFromSupabase,
  });

  if (isLoading) {
    return <div>Загрузка компаний...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки компаний: {(error as Error).message}</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите компанию" />
      </SelectTrigger>
      <SelectContent>
        {companies && companies.map((company) => (
          <SelectItem key={company.id} value={company.name || `company-${company.id}`}>
            {company.name || `Компания ${company.id}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySelect;
