
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
  categories?: { id: string, name: string }[] | string[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, categories }) => {
  // Default categories to use if none are provided
  const defaultCategories = [
    { id: "1", name: "Зарплата" },
    { id: "2", name: "Аренда" },
    { id: "3", name: "Продажи" },
    { id: "4", name: "Маркетинг" },
    { id: "5", name: "ИТ" },
    { id: "6", name: "Офисные расходы" }
  ];

  // Use provided categories or default to the predefined list
  const categoriesToUse = categories || defaultCategories;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        {Array.isArray(categoriesToUse) && categoriesToUse.map((category, index) => {
          // Handle both object format and string format
          if (typeof category === 'string') {
            return (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            );
          } else {
            return (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            );
          }
        })}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
