
import { supabase } from '@/lib/supabase';
import { Budget, BudgetPeriod, ServerBudget } from '@/types/budget';

// Получить список бюджетов
export const fetchBudgetsSupabase = async (
  period?: BudgetPeriod,
  year?: number,
  month?: number,
  type?: 'income' | 'expense',
  company?: string
): Promise<Budget[]> => {
  try {
    let query = supabase.from('budgets').select('*');
    
    if (period) query = query.eq('period', period);
    if (year) query = query.eq('year', year);
    if (month) query = query.eq('month', month);
    if (type) query = query.eq('type', type);
    if (company) query = query.eq('company', company);
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data.map(budget => ({
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      year: budget.year,
      month: budget.month,
      type: budget.type,
      createdBy: budget.created_by,
      createdAt: new Date(budget.created_at),
      company: budget.company,
    }));
  } catch (error) {
    console.error('Error fetching budgets from Supabase:', error);
    return [];
  }
};

// Создать новый бюджет
export const createBudgetSupabase = async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
  try {
    const supabaseBudget = {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      year: budget.year,
      month: budget.month,
      type: budget.type,
      created_by: budget.createdBy,
      created_at: new Date().toISOString(),
      company: budget.company,
    };
    
    const { data, error } = await supabase
      .from('budgets')
      .insert(supabaseBudget)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      category: data.category,
      amount: data.amount,
      period: data.period,
      year: data.year,
      month: data.month,
      type: data.type,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      company: data.company,
    };
  } catch (error) {
    console.error('Error creating budget in Supabase:', error);
    throw error;
  }
};

// Обновить бюджет
export const updateBudgetSupabase = async (id: string, budget: Partial<Budget>): Promise<Budget> => {
  try {
    const supabaseBudget: any = {};
    
    if (budget.category !== undefined) supabaseBudget.category = budget.category;
    if (budget.amount !== undefined) supabaseBudget.amount = budget.amount;
    if (budget.period !== undefined) supabaseBudget.period = budget.period;
    if (budget.year !== undefined) supabaseBudget.year = budget.year;
    if (budget.month !== undefined) supabaseBudget.month = budget.month;
    if (budget.type !== undefined) supabaseBudget.type = budget.type;
    if (budget.createdBy !== undefined) supabaseBudget.created_by = budget.createdBy;
    if (budget.company !== undefined) supabaseBudget.company = budget.company;
    
    if (budget.createdAt) {
      supabaseBudget.created_at = budget.createdAt instanceof Date 
        ? budget.createdAt.toISOString() 
        : budget.createdAt;
    }
    
    const { data, error } = await supabase
      .from('budgets')
      .update(supabaseBudget)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      category: data.category,
      amount: data.amount,
      period: data.period,
      year: data.year,
      month: data.month,
      type: data.type,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      company: data.company,
    };
  } catch (error) {
    console.error('Error updating budget in Supabase:', error);
    throw error;
  }
};

// Удалить бюджет
export const deleteBudgetSupabase = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting budget from Supabase:', error);
    throw error;
  }
};
