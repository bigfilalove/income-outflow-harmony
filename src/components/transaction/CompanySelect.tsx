
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
  
  const updateCompanies = () => {
    setCompanies(getCompanies());
  };

  useEffect(() => {
    // Load companies on mount
    updateCompanies();
    
    // Update companies list when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companies') {
        updateCompanies();
      }
    };
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleLocalUpdate = () => updateCompanies();
    window.addEventListener('companiesUpdated', handleLocalUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companiesUpdated', handleLocalUpdate);
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
