
import { supabase } from '@/lib/supabase';
import { CategoryList, CategoryType } from '@/types/transaction';

// Fetch category statistics from Supabase
export const fetchCategoryStats = async (): Promise<Record<string, { category: string; count: number }[]>> => {
  try {
    // Query categories from Supabase
    const { data, error } = await supabase
      .from('categories')
      .select('name, type, id');
      
    if (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
    
    // Process the data to match the expected return format
    const stats: Record<string, { category: string; count: number }[]> = {
      income: [],
      expense: [],
      reimbursement: [],
      transfer: [],
      investment: []
    };
    
    // Count occurrences of each category
    if (data) {
      for (const category of data) {
        const type = category.type as keyof typeof stats;
        if (stats[type]) {
          const existingCategory = stats[type].find(c => c.category === category.name);
          if (existingCategory) {
            existingCategory.count += 1;
          } else {
            stats[type].push({ category: category.name, count: 1 });
          }
        }
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error in fetchCategoryStats:', error);
    // Return empty stats on error
    return { income: [], expense: [], reimbursement: [], transfer: [], investment: [] };
  }
};

// Get all categories organized by type
export const fetchCategoriesByType = async (): Promise<CategoryList> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name, type')
      .order('name');
      
    if (error) {
      console.error('Error fetching categories by type:', error);
      throw error;
    }
    
    const categoryList: CategoryList = {
      income: [],
      expense: [],
      reimbursement: [],
      transfer: [],
      investment: []
    };
    
    if (data) {
      data.forEach((category) => {
        const type = category.type as CategoryType;
        if (categoryList[type]) {
          categoryList[type].push(category.name);
        }
      });
    }
    
    return categoryList;
  } catch (error) {
    console.error('Error in fetchCategoriesByType:', error);
    // Return default categories on error
    return {
      income: ['Продажа лестницы', 'Продажа прочих изделий', 'Инвестиции', 'Возврат подотчетной суммы', 'Другое'],
      expense: ['ФОТ', 'Металл', 'IT-инфраструктура', 'Маркетинг', 'Комиссии банка – Т-Банк', 'Под отчетные средства', 'Аренда офисного помещения', 'Налоги', 'Другое'],
      reimbursement: ['Другое'],
      transfer: ['Перевод между счетами'],
      investment: ['Вклад собственника', 'Инвестиции партнера', 'Другое'],
    };
  }
};
