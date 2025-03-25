import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, getCompanies, saveCompanies, getProjects, saveProjects } from '@/types/transaction';
import { toast } from "sonner";
import { 
  createTransaction, 
  deleteTransaction as apiDeleteTransaction, 
  updateTransactionStatus, 
  updateTransaction as apiUpdateTransaction 
} from '@/services/api';

export const useTransactionOperations = (handleAuthError: (error: unknown) => void) => {
  const queryClient = useQueryClient();
  
  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: unknown) => {
      handleAuthError(error);
    }
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: apiUpdateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: unknown) => {
      handleAuthError(error);
    }
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: apiDeleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: unknown) => {
      handleAuthError(error);
    }
  });

  // Update reimbursement status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' }) => 
      updateTransactionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: unknown) => {
      handleAuthError(error);
    }
  });

  const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
    try {
      await addTransactionMutation.mutateAsync(transaction);
      
      let toastTitle = transaction.type === 'income' ? 'Доход добавлен' : 'Расход добавлен';
      if (transaction.isReimbursement) {
        toastTitle = 'Возмещение добавлено';
      }
      
      toast(toastTitle, {
        description: `${transaction.description} было успешно добавлено.`
      });
      
      if (transaction.company && !getCompanies().includes(transaction.company)) {
        const companies = getCompanies();
        companies.push(transaction.company);
        saveCompanies(companies);
        
        console.log("Dispatching company updated event");
        window.dispatchEvent(new Event('companiesUpdated'));
      }
      
      if (transaction.project && !getProjects().includes(transaction.project)) {
        const projects = getProjects();
        projects.push(transaction.project);
        saveProjects(projects);
        
        console.log("Dispatching project updated event");
        window.dispatchEvent(new Event('projectsUpdated'));
      }
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось добавить транзакцию.'
      });
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction): Promise<void> => {
    try {
      await updateTransactionMutation.mutateAsync(transaction);
      
      let toastTitle = transaction.type === 'income' ? 'Доход обновлен' : 'Расход обновлен';
      if (transaction.isReimbursement) {
        toastTitle = 'Возмещение обновлено';
      }
      
      toast(toastTitle, {
        description: `${transaction.description} было успешно обновлено.`
      });
      
      if (transaction.company && !getCompanies().includes(transaction.company)) {
        const companies = getCompanies();
        companies.push(transaction.company);
        saveCompanies(companies);
        
        window.dispatchEvent(new Event('companiesUpdated'));
      }
      
      if (transaction.project && !getProjects().includes(transaction.project)) {
        const projects = getProjects();
        projects.push(transaction.project);
        saveProjects(projects);
        
        window.dispatchEvent(new Event('projectsUpdated'));
      }
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось обновить транзакцию.'
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string, transactions: Transaction[]): Promise<void> => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    try {
      await deleteTransactionMutation.mutateAsync(id);
      
      let toastTitle = transaction.type === 'income' ? 'Доход удален' : 'Расход удален';
      if (transaction.isReimbursement) {
        toastTitle = 'Возмещение удалено';
      }
      
      toast(toastTitle, {
        description: `${transaction.description} было успешно удалено.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось удалить транзакцию.'
      });
      throw error; // Перебрасываем ошибку
    }
  };

  const updateReimbursementStatus = async (id: string, status: 'completed', transactions: Transaction[]): Promise<void> => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction || !transaction.isReimbursement) return;
    
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      
      toast("Статус обновлен", {
        description: `Возмещение для "${transaction.description}" отмечено как выполненное.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось обновить статус возмещения.'
      });
      throw error; // Перебрасываем ошибку
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateReimbursementStatus
  };
};