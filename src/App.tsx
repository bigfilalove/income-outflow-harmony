
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// We'll wrap the entire app in the AuthProvider in the router, not here

function App() {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Загрузка...</div>}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="finance-tracker-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </HelmetProvider>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
