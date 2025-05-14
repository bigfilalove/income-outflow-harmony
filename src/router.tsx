
import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Transactions from './pages/Transactions';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Landing from './pages/Landing';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Analytics from './pages/Analytics';
import BasicTransactions from './pages/BasicTransactions';
import Budgeting from './pages/Budgeting';
import FinancialReports from './pages/FinancialReports';
import { TransactionProvider } from './context/transaction';

// Root layout with TransactionProvider
const RootLayout = () => {
  return (
    <TransactionProvider>
      <Outlet />
    </TransactionProvider>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/register" element={<Register />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="/basic-transactions" element={<BasicTransactions />} />
      <Route path="/budgeting" element={<Budgeting />} />
      <Route path="/financial-reports" element={<FinancialReports />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
