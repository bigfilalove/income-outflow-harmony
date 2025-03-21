
import { useEffect, useState } from 'react';
import { useTransactions } from '@/context/transaction';
import { fetchPredictions, PredictionData } from '@/services/api/predictions';
import { predictBalance, predictCategoryExpenses, predictExpenses, predictIncome } from '@/utils/predictionUtils';

export function usePredictions() {
  const { transactions } = useTransactions();
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const data = await fetchPredictions();
        setPredictionData(data);
      } catch (err) {
        console.log('Failed to fetch predictions from API, using local calculations', err);
        
        // Calculate locally as fallback
        if (transactions.length > 0) {
          // Calculate current balance
          const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
          const currentBalance = totalIncome - totalExpense;
          
          // Predict next month
          const predictedIncome = predictIncome(transactions);
          const predictedExpense = predictExpenses(transactions);
          const predictedBalance = predictBalance(transactions, currentBalance);
          const topExpenseCategories = predictCategoryExpenses(transactions).slice(0, 5);
          
          setPredictionData({
            currentBalance,
            predictedIncome,
            predictedExpense,
            predictedBalance,
            topExpenseCategories
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [transactions]);

  return { predictionData, loading, error };
}
