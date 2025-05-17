
import { supabase } from '@/lib/supabase';
import { InvestmentExpense } from '@/types/investment';
import { createTransactionInSupabase } from '@/services/api/supabase/transactions';
import { Transaction } from '@/types/transaction';

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

// Добавление нового расхода к инвестиции и создание соответствующей обычной транзакции
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

// Удаление расхода и связанной с ним транзакции
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

// Обновление расхода и связанной с ним транзакции
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
