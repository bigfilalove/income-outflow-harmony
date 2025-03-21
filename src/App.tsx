
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TransactionProvider } from "@/context/TransactionContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import BasicTransactions from "./pages/BasicTransactions";
import Analytics from "./pages/Analytics";
import Budgeting from "./pages/Budgeting";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <TransactionProvider>
            <BudgetProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                
                <Route path="/" element={
                  <ProtectedRoute allowBasicUser={false}>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute allowBasicUser={false}>
                    <Transactions />
                  </ProtectedRoute>
                } />
                <Route path="/transactions-basic" element={
                  <ProtectedRoute>
                    <BasicTransactions />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute allowBasicUser={false}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/budgeting" element={
                  <ProtectedRoute allowBasicUser={false}>
                    <Budgeting />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BudgetProvider>
          </TransactionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
