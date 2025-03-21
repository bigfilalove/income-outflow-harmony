
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
  companies?: { id: string, name: string }[] | string[];
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange, companies }) => {
  // Default companies if none provided
  const defaultCompanies = [
    { id: "1", name: "ООО Технологии" },
    { id: "2", name: "ИП Иванов" },
    { id: "3", name: "АО СтройГрад" },
    { id: "4", name: "ООО Инвест" }
  ];

  // Use provided companies or default to predefined list
  const companiesToUse = companies || defaultCompanies;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите компанию" />
      </SelectTrigger>
      <SelectContent>
        {Array.isArray(companiesToUse) && companiesToUse.map((company, index) => {
          // Handle both object format and string format
          if (typeof company === 'string') {
            return (
              <SelectItem key={index} value={company}>
                {company}
              </SelectItem>
            );
          } else {
            return (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            );
          }
        })}
      </SelectContent>
    </Select>
  );
};

export default CompanySelect;
