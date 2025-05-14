
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryList, fetchCategoriesFromAPI, getTransactionCategories, saveCategories } from '@/types/transaction';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'income' | 'expense' | 'reimbursement' | 'transfer' | 'investment';
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, type }) => {
  const [categories, setCategories] = useState<CategoryList>(getTransactionCategories());

  // Fetch categories from API or use cached ones
  const { data: apiCategories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesFromAPI,
    // Only refetch on mount or when type changes
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Update categories when API data changes
  useEffect(() => {
    if (apiCategories) {
      setCategories(apiCategories);
      saveCategories(apiCategories);
    }
  }, [apiCategories]);

  // Listen for manual category updates
  useEffect(() => {
    const handleCategoriesUpdated = () => {
      setCategories(getTransactionCategories());
    };
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
  }, []);

  // This will be the array of categories for the selected type
  const typeCategories = categories[type] || [];

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
        {typeCategories.length > 0 ? (
          typeCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            Нет доступных категорий
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
