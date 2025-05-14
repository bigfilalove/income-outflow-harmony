
// Re-export all API functions
export * from './auth';
export * from './transactions';
export * from './predictions';
export * from './budgets';

// Re-export Supabase API functions
export * from './supabase';

// Export the fetchTransactions function that uses Supabase
export { fetchTransactionsFromSupabase as fetchTransactions } from './supabase/transactions';
export { fetchCategoriesFromSupabase as fetchCategories } from './supabase/categories';
export { fetchBudgetsFromSupabase as fetchBudgets } from './supabase/budgets';
