import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories } from '@/lib';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'income' | 'expense' | 'reimbursement'; // Добавляем пропс для фильтрации
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, type }) => {
  // Загружаем категории через API с фильтрацией по типу
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories', type],
    queryFn: () => fetchCategories(type),
  });

  if (isLoading) {
    return <div>Загрузка категорий...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки категорий: {error.message}</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;