
import { createBrowserRouter } from 'react-router-dom';
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/advanced-analytics',
    element: <AdvancedAnalytics />,
  },
  {
    path: '/basic-transactions',
    element: <BasicTransactions />,
  },
  {
    path: '/budgeting',
    element: <Budgeting />,
  },
  {
    path: '/financial-reports',
    element: <FinancialReports />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
