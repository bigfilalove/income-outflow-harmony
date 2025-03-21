
import { API_URL, createAuthHeaders } from './config';

export interface PredictionData {
  currentBalance: number;
  predictedIncome: number;
  predictedExpense: number;
  predictedBalance: number;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
  }>;
}

export const fetchPredictions = async (): Promise<PredictionData> => {
  try {
    const response = await fetch(`${API_URL}/predictions`, {
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};
