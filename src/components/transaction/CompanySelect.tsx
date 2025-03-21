
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
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
  // Список компаний для выбора
  const companies = [
    { id: "1", name: "ООО Технологии" },
    { id: "2", name: "ИП Иванов" },
    { id: "3", name: "АО СтройГрад" },
    { id: "4", name: "ООО Инвест" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите компанию" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySelect;
