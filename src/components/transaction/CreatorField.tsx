
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface CreatorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CreatorField: React.FC<CreatorFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="createdBy">ФИО сотрудника</Label>
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <Input
          id="createdBy"
          placeholder="Введите ФИО"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default CreatorField;
