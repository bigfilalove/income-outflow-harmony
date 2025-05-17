
import { supabase } from '@/lib/supabase';

/**
 * Deletes an investment expense and its associated transaction
 * @param expenseId The ID of the expense to delete
 * @returns A promise that resolves when the operation is complete
 */
export const deleteInvestmentExpense = async (expenseId: string): Promise<void> => {
  try {
    // Сначала удаляем связанную транзакцию (если есть)
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id')
        .eq('investment_expense_id', expenseId);
      
      if (data && data.length > 0) {
        await supabase
          .from('transactions')
          .delete()
          .eq('investment_expense_id', expenseId);
        
        console.log('Удалена связанная транзакция расхода инвестиции:', expenseId);
      }
    } catch (transactionError) {
      console.error('Ошибка при удалении связанной транзакции:', transactionError);
      // Не прерываем основной процесс, если не удалось удалить транзакцию
    }

    // Затем удаляем сам расход инвестиции
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
