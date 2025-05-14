
import { supabase } from '@/lib/supabase';
import { CategoryType } from '@/types/transaction';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  createdAt: Date;
}

// Получить список категорий
export const fetchCategoriesSupabase = async (type?: CategoryType): Promise<Category[]> => {
  try {
    let query = supabase.from('categories').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      type: category.type,
      createdAt: new Date(category.created_at),
    }));
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    return [];
  }
};

// Создать новую категорию
export const createCategorySupabase = async (name: string, type: CategoryType): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        type,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error creating category in Supabase:', error);
    return null;
  }
};

// Удалить категорию
export const deleteCategorySupabase = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting category from Supabase:', error);
    return false;
  }
};
