
import { useState, useEffect } from 'react';
import { ProjectAllocation } from '@/types/transaction';
import { toast } from 'sonner';

export const useTransactionFormValidator = (
  hasAllocations: boolean,
  projectAllocations: ProjectAllocation[],
  amount: string
) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasAllocations) {
      setIsValid(true);
      setValidationMessage(null);
      return;
    }

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      setIsValid(false);
      setValidationMessage('Введите корректную сумму');
      return;
    }
    
    // Проверка корректности распределения по проектам
    const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    if (allocatedTotal !== numAmount) {
      setIsValid(false);
      setValidationMessage("Сумма распределений должна быть равна общей сумме транзакции");
      return;
    }
    
    // Проверка наличия дубликатов проектов
    const projectsSet = new Set(projectAllocations.map(a => a.project));
    if (projectAllocations.length !== projectsSet.size) {
      setIsValid(false);
      setValidationMessage("Один проект используется несколько раз в распределении");
      return;
    }
    
    setIsValid(true);
    setValidationMessage(null);
  }, [hasAllocations, projectAllocations, amount]);

  const validateForm = (): boolean => {
    if (!hasAllocations) return true;
    
    const numAmount = parseFloat(amount);
    
    // Проверка корректности распределения по проектам
    if (hasAllocations) {
      const allocatedTotal = projectAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
      if (allocatedTotal !== numAmount) {
        toast("Ошибка", {
          description: "Сумма распределений должна быть равна общей сумме транзакции",
        });
        return false;
      }
      
      // Проверка наличия дубликатов проектов
      const projectsSet = new Set(projectAllocations.map(a => a.project));
      if (projectAllocations.length !== projectsSet.size) {
        toast("Ошибка", {
          description: "Один проект используется несколько раз в распределении",
        });
        return false;
      }
    }
    
    return true;
  };

  return {
    isValid,
    validationMessage,
    validateForm
  };
};
