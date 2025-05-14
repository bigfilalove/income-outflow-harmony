
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

function App() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Загрузка...</div>}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="finance-tracker-theme">
            <AuthProvider>
              <AdminProvider>
                <RouterProvider router={router} />
              </AdminProvider>
            </AuthProvider>
          </ThemeProvider>
        </HelmetProvider>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
