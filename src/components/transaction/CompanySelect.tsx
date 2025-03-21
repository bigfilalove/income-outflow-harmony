
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCompanies } from '@/types/transaction';

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
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
    <div className="space-y-2">
      <Label htmlFor="company">Компания</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="company">
          <SelectValue placeholder="Выберите компанию" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company} value={company}>
              {company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelect;
