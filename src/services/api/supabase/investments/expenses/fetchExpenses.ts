
import { supabase } from '@/lib/supabase';
import { InvestmentExpense } from '@/types/investment';

/**
 * Fetches expenses for a specific investment
 * @param investmentId The ID of the investment to fetch expenses for
 * @returns A promise that resolves to an array of investment expenses
 */
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
