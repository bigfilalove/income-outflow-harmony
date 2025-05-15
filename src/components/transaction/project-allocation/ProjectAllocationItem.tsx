
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { ProjectAllocationItemProps } from './types';

const ProjectAllocationItem: React.FC<ProjectAllocationItemProps> = ({
  allocation,
  index,
  projects,
  onUpdate,
  onRemove,
  disabled,
  allocations,
  transactionType = 'expense'
}) => {
  const isIncome = transactionType === 'income';
  const placeholderText = isIncome ? "Сумма дохода" : "Сумма";
  
  return (
    <div className="flex items-center gap-2">
      <Select
        value={allocation.project}
        onValueChange={(value) => onUpdate(index, 'project', value)}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Выберите проект" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem
              key={project}
              value={project}
              disabled={allocations.some((a, i) => i !== index && a.project === project)}
            >
              {project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        type="number"
        placeholder={placeholderText}
        className="w-28"
        min={0}
        max={allocation.amount}
        value={allocation.amount || ''}
        onChange={(e) => onUpdate(index, 'amount', e.target.value)}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default ProjectAllocationItem;
