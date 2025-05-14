
// Re-export all API functions
export * from './transactions';
export * from './predictions';
export * from './budgets';

// Экспортируем функции Supabase API
export * from './supabase';

// Напрямую экспортируем реализации Supabase
export { fetchTransactionsFromSupabase as fetchTransactions } from './supabase/transactions';
export { createTransactionInSupabase as createTransaction } from './supabase/transactions';
export { updateTransactionInSupabase as updateTransaction } from './supabase/transactions';
export { deleteTransactionFromSupabase as deleteTransaction } from './supabase/transactions';
export { updateTransactionStatusInSupabase as updateTransactionStatus } from './supabase/transactions';
export { fetchCategoriesFromSupabase as fetchCategories } from './supabase/categories';
export { fetchBudgetsFromSupabase as fetchBudgets } from './supabase/budgets';

// Export auth functions
export { checkAuthSupabase as checkAuth } from './supabase/auth';
