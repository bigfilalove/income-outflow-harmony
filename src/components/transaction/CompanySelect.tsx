
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { companies } from '@/types/transaction';

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
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
