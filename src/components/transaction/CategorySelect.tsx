
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories } from '@/lib/categories';
import { CategoryType } from '@/types/transaction';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: CategoryType; // Updated to accept all CategoryType values
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, type }) => {
  // For transfer type, we'll use expense categories as a fallback
  const categoryType = type === 'transfer' ? 'expense' : type;
  
  // Загружаем категории через API с фильтрацией по типу
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories', categoryType],
    queryFn: () => fetchCategories(categoryType),
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
