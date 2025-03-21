
import React from 'react';
import Navbar from '@/components/Navbar';
import BudgetList from '@/components/budget/BudgetList';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetAnalysis from '@/components/budget/BudgetAnalysis';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBarChart, PieChart } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-6 bg-red-50 rounded-lg border border-red-200">
      <h2 className="text-lg font-semibold text-red-800">Что-то пошло не так</h2>
      <p className="text-sm text-red-600 mt-2">{error.message}</p>
    </div>
  );
}

const Budgeting = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Бюджетирование</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
              {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'})
            </div>
          )}
        </div>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Tabs defaultValue="budgets" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="budgets" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Бюджеты
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center">
                <FileBarChart className="h-4 w-4 mr-2" />
                Факт vs План
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="budgets" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <BudgetList />
                  </ErrorBoundary>
                </div>
                <div>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <BudgetForm />
                  </ErrorBoundary>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6 mt-6">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <BudgetAnalysis />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Budgeting;
