
import { supabase } from '@/lib/supabase';
import { InvestmentExpense } from '@/types/investment';
import { Transaction } from '@/types/transaction';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';

/**
 * Adds a new expense to an investment and creates a corresponding regular transaction
 * @param expense The expense to add
 * @returns A promise that resolves to the added expense
 */
export const addInvestmentExpense = async (expense: Omit<InvestmentExpense, 'id' | 'created_at'>): Promise<InvestmentExpense> => {
  try {
    // Шаг 1: Добавляем расход к инвестиции
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

    // Шаг 2: Создаем соответствующую транзакцию расхода в основной таблице
    const transaction: Omit<Transaction, 'id'> = {
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      date: expense.date,
      type: 'expense',
      createdBy: expense.created_by || undefined,
      company: expense.project ? undefined : expense.created_by,
      project: expense.project || undefined,
      createdAt: new Date(),
      // Добавляем метаданные об инвестиции
      isInvestment: false,
      // Помечаем, что транзакция создана из расхода инвестиции
      investmentExpenseId: data.id
    };

    try {
      await createTransactionInSupabase(transaction);
      console.log('Создана обычная транзакция из расхода инвестиции:', data.id);
    } catch (transactionError) {
      console.error('Ошибка при создании обычной транзакции из расхода инвестиции:', transactionError);
      // Не прерываем основной процесс, если не удалось создать транзакцию,
      // но логируем ошибку для дальнейшего анализа
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
