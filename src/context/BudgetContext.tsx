
import React, { createContext, useContext, useEffect } from 'react';
import { Budget, BudgetPeriod } from '@/types/budget';
import { toast } from "sonner";
import { fetchBudgets, createBudget, updateBudget, deleteBudget as apiDeleteBudget } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface BudgetContextType {
  budgets: Budget[];
  isLoading: boolean;
  error: Error | null;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetsByPeriod: (period: BudgetPeriod, year: number, month: number) => Budget[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle authentication errors
  const handleAuthError = (error: any) => {
    if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
      toast("Ошибка аутентификации", {
        description: "Ваша сессия истекла. Пожалуйста, войдите снова."
      });
      logout();
      navigate('/login');
    }
  };
  
  // Fetch budgets query
  const { 
    data: budgets = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => fetchBudgets(),
    retry: 1,
    meta: {
      onError: (error: any) => {
        handleAuthError(error);
      }
    }
  });

  // Add budget mutation
  const addBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, budget }: { id: string; budget: Partial<Budget> }) => 
      updateBudget(id, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: apiDeleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error) => {
      handleAuthError(error);
    }
  });

  const addBudget = async (budget: Omit<Budget, 'id'>): Promise<void> => {
    try {
      await addBudgetMutation.mutateAsync(budget);
      
      toast("Бюджет добавлен", {
        description: `Бюджет для категории ${budget.category} был успешно добавлен.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось добавить бюджет.'
      });
      throw error;
    }
  };

  const updateBudgetHandler = async (id: string, budget: Partial<Budget>): Promise<void> => {
    try {
      await updateBudgetMutation.mutateAsync({ id, budget });
      
      toast("Бюджет обновлен", {
        description: `Бюджет для категории ${budget.category || ''} был успешно обновлен.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось обновить бюджет.'
      });
      throw error;
    }
  };

  const deleteBudgetHandler = async (id: string): Promise<void> => {
    const budget = budgets.find(b => b.id === id);
    if (!budget) return;
    
    try {
      await deleteBudgetMutation.mutateAsync(id);
      
      toast("Бюджет удален", {
        description: `Бюджет для категории ${budget.category} был успешно удален.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось удалить бюджет.'
      });
    }
  };

  const getBudgetsByPeriod = (period: BudgetPeriod, year: number, month: number): Budget[] => {
    return budgets.filter(b => 
      b.period === period && b.year === year && b.month === month
    );
  };

  return (
    <BudgetContext.Provider value={{ 
      budgets,
      isLoading,
      error: error as Error | null,
      addBudget,
      updateBudget: updateBudgetHandler,
      deleteBudget: deleteBudgetHandler,
      getBudgetsByPeriod
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
