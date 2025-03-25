import { API_URL, get } from './config';
import { createAuthHeaders } from './config';

export interface Company {
  id: string;
  _id?: string; // Add optional _id field for MongoDB compatibility
  name: string;
  createdAt: Date;
}

// Получить список всех компаний
export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const data = await get<Company[]>('/companies');
    return data.map(company => ({
      id: company.id || company._id || '',
      name: company.name,
      createdAt: new Date(company.createdAt),
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

// Добавить новую компанию
export const createCompany = async (name: string): Promise<Company | null> => {
  try {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(),
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create company');
    }

    const data = await response.json();
    return {
      id: data.id || data._id,
      name: data.name,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Error creating company:', error);
    return null;
  }
};

// Обновить компанию
export const updateCompany = async (id: string, name: string): Promise<Company | null> => {
  try {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(),
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to update company');
    }

    const data = await response.json();
    return {
      id: data.id || data._id,
      name: data.name,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Error updating company:', error);
    return null;
  }
};

// Удалить компанию
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete company');
    }

    return true;
  } catch (error) {
    console.error('Error deleting company:', error);
    return false;
  }
};
