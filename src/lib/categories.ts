
import { API_URL, get } from './config';
import { createAuthHeaders } from './config';
import { CategoryType } from '@/types/transaction';

export interface Category {
  id: string;
  _id?: string; // Add optional _id field for MongoDB compatibility
  name: string;
  type: CategoryType;
  createdAt: Date;
}

// Получить список всех категорий с возможной фильтрацией по типу
export const fetchCategories = async (type?: CategoryType): Promise<Category[]> => {
  try {
    const query = type ? `?type=${type}` : '';
    const data = await get<Category[]>(`/categories${query}`);
    return data.map(category => ({
      id: category.id || category._id || '',
      name: category.name,
      type: category.type,
      createdAt: new Date(category.createdAt),
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Добавить новую категорию
export const createCategory = async (name: string, type: CategoryType): Promise<Category | null> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(),
      },
      body: JSON.stringify({ name, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    const data = await response.json();
    return {
      id: data.id || data._id,
      name: data.name,
      type: data.type,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// Удалить категорию
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};
