
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ReimbursementFieldsProps {
  isReimbursement: boolean;
  onReimbursementChange: (checked: boolean) => void;
  reimbursedTo: string;
  onReimbursedToChange: (value: string) => void;
}

const ReimbursementFields: React.FC<ReimbursementFieldsProps> = ({
  isReimbursement,
  onReimbursementChange,
  reimbursedTo,
  onReimbursedToChange
}) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="reimbursement" 
          checked={isReimbursement}
          onCheckedChange={(checked: boolean) => onReimbursementChange(checked)}
        />
        <Label htmlFor="reimbursement" className="cursor-pointer">
          Расход из личных средств (требуется возмещение)
        </Label>
      </div>

      {isReimbursement && (
        <div className="space-y-2">
          <Label htmlFor="reimbursedTo">Кому возместить</Label>
          <Input
            id="reimbursedTo"
            placeholder="Имя сотрудника"
            value={reimbursedTo}
            onChange={(e) => onReimbursedToChange(e.target.value)}
            required={isReimbursement}
          />
        </div>
      )}
    </>
  );
};

export default ReimbursementFields;
