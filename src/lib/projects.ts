
import { API_URL, get } from './config';
import { createAuthHeaders } from './config';

export interface Project {
  id: string;
  _id?: string; // Add optional _id field for MongoDB compatibility
  name: string;
  createdAt: Date;
}

// Получить список всех проектов
export const fetchProjects = async (): Promise<string[]> => {
  try {
    // В будущем, когда проекты будут храниться в базе данных:
    // const data = await get<Project[]>('/projects');
    // return data.map(project => project.name);
    
    // Пока используем заглушку
    return [
      'Лестница в дом', 
      'Перила для веранды', 
      'Навес для автомобиля', 
      'Ограждение участка'
    ];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Добавить новый проект
export const createProject = async (name: string): Promise<boolean> => {
  try {
    // В будущем, когда API для проектов будет реализовано:
    /*
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(),
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error creating project:', error);
    return false;
  }
};

// Удалить проект
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    // В будущем, когда API для проектов будет реализовано:
    /*
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};
