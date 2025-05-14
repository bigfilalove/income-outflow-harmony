
import { supabase } from '@/lib/supabase';
import { CategoryList } from '@/types/transaction';

// Получение всех категорий из Supabase
export const fetchCategoriesFromSupabase = async (): Promise<CategoryList> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      throw error;
    }

    // Преобразуем данные из Supabase в формат приложения
    const categoryList: CategoryList = {
      income: [],
      expense: [],
      reimbursement: [],
      transfer: [],
      investment: [],
    };

    data.forEach((category) => {
      if (category.type === 'income') {
        categoryList.income.push(category.name);
      } else if (category.type === 'expense') {
        categoryList.expense.push(category.name);
      } else if (category.type === 'reimbursement') {
        categoryList.reimbursement.push(category.name);
      } else if (category.type === 'transfer') {
        categoryList.transfer.push(category.name);
      } else if (category.type === 'investment') {
        categoryList.investment.push(category.name);
      }
    });

    return categoryList;
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    // Возвращаем дефолтные категории в случае ошибки
    return {
      income: ['Продажа лестницы', 'Продажа прочих изделий', 'Инвестиции', 'Возврат подотчетной суммы', 'Другое'],
      expense: ['ФОТ', 'Металл', 'IT-инфраструктура', 'Маркетинг', 'Комиссии банка – Т-Банк', 'Под отчетные средства', 'Аренда офисного помещения', 'Налоги', 'Другое'],
      reimbursement: ['Другое'],
      transfer: [],
      investment: ['Вклад собственника', 'Инвестиции партнера', 'Другое'],
    };
  }
};

// Добавление новой категории
export const addCategoryToSupabase = async (name: string, type: 'income' | 'expense' | 'reimbursement' | 'transfer'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .insert({ name, type });

    if (error) {
      console.error('Error adding category to Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding category to Supabase:', error);
    throw error;
  }
};

// Удаление категории
export const deleteCategoryFromSupabase = async (name: string, type: 'income' | 'expense' | 'reimbursement' | 'transfer'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name)
      .eq('type', type);

    if (error) {
      console.error('Error deleting category from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting category from Supabase:', error);
    throw error;
  }
};
