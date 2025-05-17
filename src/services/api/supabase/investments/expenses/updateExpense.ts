
import { supabase } from '@/lib/supabase';
import { InvestmentExpense } from '@/types/investment';
import { Transaction } from '@/types/transaction';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';

/**
 * Updates an investment expense and its associated transaction
 * @param expense The updated expense data
 * @returns A promise that resolves to the updated expense
 */
export const updateInvestmentExpense = async (expense: InvestmentExpense): Promise<InvestmentExpense> => {
  try {
    // Шаг 1: Обновляем расход инвестиции
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

    // Шаг 2: Обновляем связанную транзакцию (если есть)
    try {
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('id')
        .eq('investment_expense_id', expense.id);
      
      if (transactionData && transactionData.length > 0) {
        const transactionId = transactionData[0].id;
        
        await supabase
          .from('transactions')
          .update({
            amount: expense.amount,
            description: expense.description,
            category: expense.category,
            date: expense.date.toISOString(),
            created_by: expense.created_by || null,
            company: expense.project ? null : expense.created_by,
            project: expense.project || null
          })
          .eq('id', transactionId);
        
        console.log('Обновлена связанная транзакция расхода инвестиции:', expense.id);
      } else {
        // Если связанной транзакции нет, создаем новую
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
          isInvestment: false,
          investmentExpenseId: expense.id
        };

        await createTransactionInSupabase(transaction);
        console.log('Создана новая транзакция из расхода инвестиции:', expense.id);
      }
    } catch (transactionError) {
      console.error('Ошибка при обновлении связанной транзакции:', transactionError);
      // Не прерываем основной процесс, если не удалось обновить транзакцию
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
