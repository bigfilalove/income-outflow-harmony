
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySelectProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, value, onChange }) => {
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
