
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProjectAllocation } from '@/types/transaction';

interface AllocationToggleProps {
  hasAllocations: boolean;
  onToggleAllocations: (hasAllocations: boolean) => void;
  projectAllocations: ProjectAllocation[];
  amount: string;
}

const AllocationToggle: React.FC<AllocationToggleProps> = ({
  hasAllocations,
  onToggleAllocations,
  projectAllocations,
  amount
}) => {
  // Only show allocation toggle if we have an amount entered
  if (!amount) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="allocations"
        checked={hasAllocations}
        onCheckedChange={(checked) => {
          // Reset allocations when toggling off
          if (!checked && projectAllocations.length > 0) {
            onToggleAllocations(false);
          } else {
            onToggleAllocations(checked);
          }
        }}
      />
      <Label htmlFor="allocations">
        Распределить по проектам
      </Label>
    </div>
  );
};

export default AllocationToggle;
