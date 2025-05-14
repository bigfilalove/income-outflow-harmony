
// Re-export all API functions
export * from './auth';
export * from './transactions';
export * from './predictions';
export * from './budgets';

// Re-export Supabase API functions
export * from './supabase';

// Export the Supabase implementations directly 
export { fetchTransactionsFromSupabase as fetchTransactions } from './supabase/transactions';
export { fetchCategoriesFromSupabase as fetchCategories } from './supabase/categories';
export { fetchBudgetsFromSupabase as fetchBudgets } from './supabase/budgets';
export { loginWithCredentialsSupabase as loginWithCredentials } from './supabase/auth';
export { logoutSupabase as logout } from './supabase/auth';
export { checkAuthSupabase as checkAuth } from './supabase/auth';
