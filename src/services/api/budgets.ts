
import { Budget, BudgetPeriod, ServerBudget } from '@/types/budget';
import { API_URL, createAuthHeaders, get, post, put, del } from './config';

// Fetch budgets with optional filtering
export const fetchBudgets = async (
  period?: BudgetPeriod,
  year?: number,
  month?: number,
  type?: 'income' | 'expense',
  company?: string
): Promise<Budget[]> => {
  let queryParams = new URLSearchParams();
  
  if (period) queryParams.append('period', period);
  if (year) queryParams.append('year', year.toString());
  if (month) queryParams.append('month', month.toString());
  if (type) queryParams.append('type', type);
  if (company) queryParams.append('company', company);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const data = await get<ServerBudget[]>(`/budgets${query}`);
  
  return data.map(mapServerBudgetToBudget);
};

// Create a new budget
export const createBudget = async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
  const serverBudget: Omit<ServerBudget, 'id' | '_id'> = {
    ...budget,
    createdAt: new Date().toISOString()
  };
  
  const data = await post<ServerBudget>('/budgets', serverBudget);
  return mapServerBudgetToBudget(data);
};

// Update a budget
export const updateBudget = async (id: string, budget: Partial<Budget>): Promise<Budget> => {
  // Create a new object for server budget to avoid modifying the original budget
  const serverBudget: Partial<ServerBudget> = {...budget};
  
  // Convert Date object to string if it exists
  if (budget.createdAt && budget.createdAt instanceof Date) {
    serverBudget.createdAt = budget.createdAt.toISOString();
  }
  
  const data = await put<ServerBudget>(`/budgets/${id}`, serverBudget);
  return mapServerBudgetToBudget(data);
};

// Delete a budget
export const deleteBudget = async (id: string): Promise<void> => {
  await del(`/budgets/${id}`);
};

// Transform server budget to client budget
const mapServerBudgetToBudget = (serverBudget: ServerBudget): Budget => {
  return {
    id: serverBudget._id || serverBudget.id || '',
    category: serverBudget.category,
    amount: serverBudget.amount,
    period: serverBudget.period,
    year: serverBudget.year,
    month: serverBudget.month,
    type: serverBudget.type,
    createdBy: serverBudget.createdBy,
    createdAt: new Date(serverBudget.createdAt),
    company: serverBudget.company
  };
};
