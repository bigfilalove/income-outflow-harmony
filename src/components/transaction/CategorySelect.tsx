
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  // Список категорий для выбора
  const categories = [
    { id: "1", name: "Зарплата" },
    { id: "2", name: "Аренда" },
    { id: "3", name: "Продажи" },
    { id: "4", name: "Маркетинг" },
    { id: "5", name: "ИТ" },
    { id: "6", name: "Офисные расходы" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
