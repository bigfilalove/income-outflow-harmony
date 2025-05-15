
import { supabase } from '@/lib/supabase';
import { InvestmentExpense } from '@/types/investment';

// Получение расходов по конкретной инвестиции
export const fetchInvestmentExpenses = async (investmentId: string): Promise<InvestmentExpense[]> => {
  try {
    const { data, error } = await supabase
      .from('investment_expenses')
      .select('*')
      .eq('investment_id', investmentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Ошибка при загрузке расходов по инвестиции:', error.message);
      throw new Error(error.message);
    }

    // Преобразование форматов даты
    return data.map((expense: any) => ({
      ...expense,
      date: new Date(expense.date),
      created_at: expense.created_at ? new Date(expense.created_at) : undefined
    }));
  } catch (error: any) {
    console.error('Ошибка при получении расходов по инвестиции:', error.message);
    throw error;
  }
};

// Добавление нового расхода к инвестиции
export const addInvestmentExpense = async (expense: Omit<InvestmentExpense, 'id' | 'created_at'>): Promise<InvestmentExpense> => {
  try {
    const { data, error } = await supabase
      .from('investment_expenses')
      .insert([{
        ...expense,
        date: expense.date.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при добавлении расхода к инвестиции:', error.message);
      throw new Error(error.message);
    }

    return {
      ...data,
      date: new Date(data.date),
      created_at: data.created_at ? new Date(data.created_at) : undefined
    };
  } catch (error: any) {
    console.error('Ошибка при добавлении расхода к инвестиции:', error.message);
    throw error;
  }
};

// Удаление расхода
export const deleteInvestmentExpense = async (expenseId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('investment_expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      console.error('Ошибка при удалении расхода:', error.message);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Ошибка при удалении расхода:', error.message);
    throw error;
  }
};

// Обновление расхода
export const updateInvestmentExpense = async (expense: InvestmentExpense): Promise<InvestmentExpense> => {
  try {
    const { data, error } = await supabase
      .from('investment_expenses')
      .update({
        ...expense,
        date: expense.date.toISOString()
      })
      .eq('id', expense.id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении расхода:', error.message);
      throw new Error(error.message);
    }

    return {
      ...data,
      date: new Date(data.date),
      created_at: data.created_at ? new Date(data.created_at) : undefined
    };
  } catch (error: any) {
    console.error('Ошибка при обновлении расхода:', error.message);
    throw error;
  }
};
