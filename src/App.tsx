
import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "./components/theme-provider";
import { useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/transaction';
import { BudgetProvider } from './context/BudgetContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Budgeting from './pages/Budgeting';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import BasicTransactions from './pages/BasicTransactions';
import FinancialReports from './pages/FinancialReports';
import AdminLogin from './pages/AdminLogin';

// Создаем QueryClient один раз при загрузке приложения
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  
  useEffect(() => {
    // Log the current route
    console.log("Current route:", location.pathname);
  }, [location]);
  
  return (
    <div className={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TransactionProvider>
            <BudgetProvider>
              <ThemeProvider defaultTheme="light" storageKey="finance-app-theme">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/advanced-analytics" element={
                    <ProtectedRoute>
                      <AdvancedAnalytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/budgeting" element={
                    <ProtectedRoute>
                      <Budgeting />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/basic-transactions" element={
                    <ProtectedRoute>
                      <BasicTransactions />
                    </ProtectedRoute>
                  } />
                  <Route path="/financial-reports" element={
                    <ProtectedRoute>
                      <FinancialReports />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </ThemeProvider>
            </BudgetProvider>
          </TransactionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
