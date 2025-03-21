
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTransactionCategories } from '@/types/transaction';

interface CategorySelectProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories: propCategories, value, onChange }) => {
  const [categories, setCategories] = useState(propCategories);

  // Update categories if they change externally (e.g. when edited in admin)
  useEffect(() => {
    const handleCategoriesUpdated = () => {
      const allCategories = getTransactionCategories();
      // Find which category type this component is showing and update
      for (const [type, list] of Object.entries(allCategories)) {
        if (JSON.stringify(list) === JSON.stringify(propCategories)) {
          setCategories(allCategories[type as keyof typeof allCategories]);
          break;
        }
      }
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
    };
  }, [propCategories]);

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Категория</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;
