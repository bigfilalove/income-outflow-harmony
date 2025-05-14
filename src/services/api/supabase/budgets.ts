
import { supabase } from '@/lib/supabase';
import { Budget, BudgetPeriod } from '@/types/budget';

// Получение всех бюджетов из Supabase
export const fetchBudgetsFromSupabase = async (): Promise<Budget[]> => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching budgets from Supabase:', error);
      throw error;
    }

    // Преобразуем данные из Supabase в формат приложения
    return data.map((budget) => ({
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      period: budget.period as BudgetPeriod,
      year: budget.year,
      month: budget.month,
      type: budget.type as 'expense' | 'income',
      createdBy: budget.created_by || undefined,
      createdAt: budget.created_at ? new Date(budget.created_at) : new Date(),
      company: budget.company || undefined,
    }));
  } catch (error) {
    console.error('Error fetching budgets from Supabase:', error);
    throw error;
  }
};

// Создание нового бюджета
export const createBudgetInSupabase = async (budget: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget> => {
  try {
    // Преобразуем данные из формата приложения в формат Supabase
    const supabuseBudget = {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      year: budget.year,
      month: budget.month,
      type: budget.type,
      created_by: budget.createdBy || null,
      company: budget.company || null,
    };

    const { data, error } = await supabase
      .from('budgets')
      .insert(supabuseBudget)
      .select()
      .single();

    if (error) {
      console.error('Error creating budget in Supabase:', error);
      throw error;
    }

    // Возвращаем созданный бюджет в формате приложения
    return {
      id: data.id,
      category: data.category,
      amount: data.amount,
      period: data.period as BudgetPeriod,
      year: data.year,
      month: data.month,
      type: data.type as 'expense' | 'income',
      createdBy: data.created_by || undefined,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      company: data.company || undefined,
    };
  } catch (error) {
    console.error('Error creating budget in Supabase:', error);
    throw error;
  }
};

// Обновление бюджета
export const updateBudgetInSupabase = async (budget: Budget): Promise<Budget> => {
  try {
    // Преобразуем данные из формата приложения в формат Supabase
    const supabuseBudget = {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      year: budget.year,
      month: budget.month,
      type: budget.type,
      created_by: budget.createdBy || null,
      company: budget.company || null,
    };

    const { data, error } = await supabase
      .from('budgets')
      .update(supabuseBudget)
      .eq('id', budget.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget in Supabase:', error);
      throw error;
    }

    // Возвращаем обновленный бюджет в формате приложения
    return {
      id: data.id,
      category: data.category,
      amount: data.amount,
      period: data.period as BudgetPeriod,
      year: data.year,
      month: data.month,
      type: data.type as 'expense' | 'income',
      createdBy: data.created_by || undefined,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      company: data.company || undefined,
    };
  } catch (error) {
    console.error('Error updating budget in Supabase:', error);
    throw error;
  }
};

// Удаление бюджета
export const deleteBudgetFromSupabase = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting budget from Supabase:', error);
    throw error;
  }
};
