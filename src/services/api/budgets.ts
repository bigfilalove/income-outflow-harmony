
import { ServerBudget, Budget } from '@/types/budget';
import { get, post, put, del } from './config';
import { mapServerBudgetToClient } from './mappers';

// Получить все бюджеты с возможностью фильтрации
export const fetchBudgets = async (filters?: {
  period?: string;
  year?: number;
  month?: number;
  type?: string;
  company?: string;
}): Promise<Budget[]> => {
  const queryParams = new URLSearchParams();
  
  // Добавляем фильтры в query параметры
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await get<ServerBudget[]>(`/budgets${query}`);
  return response.map(mapServerBudgetToClient);
};

// Создать новый бюджет
export const createBudget = async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
  const response = await post<ServerBudget>('/budgets', budget);
  return mapServerBudgetToClient(response);
};

// Обновить существующий бюджет
export const updateBudget = async (id: string, budget: Partial<Budget>): Promise<Budget> => {
  const response = await put<ServerBudget>(`/budgets/${id}`, budget);
  return mapServerBudgetToClient(response);
};

// Удалить бюджет
export const deleteBudget = async (id: string): Promise<void> => {
  await del(`/budgets/${id}`);
};
