
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchTransactionsFromSupabase } from '@/services/api/supabase/transactions';
import { fetchInvestmentExpenses } from '@/services/api/supabase/investments';
import { Transaction } from '@/types/transaction';
import { InvestmentExpense } from '@/types/investment';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { InvestmentExpenseForm, InvestmentExpensesList } from '@/components/transaction/investment/expenses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvestmentExpensesManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedInvestment, setSelectedInvestment] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Fetch all transactions that are owner contributions or company investments
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const allTransactions = await fetchTransactionsFromSupabase();
      console.log("All transactions:", allTransactions);
      // Filter for investments - specifically owner contributions and company investments
      const investments = allTransactions.filter(transaction => 
        transaction.isInvestment || 
        transaction.category === 'Вклад собственника' ||
        transaction.category === 'Инвестиции партнера'
      );
      console.log("Filtered investment transactions:", investments);
      return investments;
    }
  });

  // Fetch expenses for selected investment
  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['investment-expenses', selectedInvestment?.id],
    queryFn: () => selectedInvestment ? fetchInvestmentExpenses(selectedInvestment.id) : Promise.resolve([]),
    enabled: !!selectedInvestment
  });

  // Auto-select investment if id is in URL
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && transactions.length > 0) {
      const investment = transactions.find(t => t.id === idParam);
      if (investment) {
        setSelectedInvestment(investment);
      }
    }
  }, [searchParams, transactions]);

  const handleInvestmentSelect = (investment: Transaction) => {
    setSelectedInvestment(investment);
    setIsFormOpen(false);
  };

  const handleAddExpense = () => {
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/transactions">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Управление расходами инвестиций</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* List of investment transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Инвестиции</CardTitle>
              <CardDescription>Выберите инвестицию для управления расходами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {isLoadingTransactions ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 border rounded-lg">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {transactions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        Инвестиции не найдены. Добавьте транзакции с категорией "Вклад собственника" или "Инвестиции партнера".
                      </div>
                    ) : (
                      transactions.map((investment) => (
                        <div 
                          key={investment.id}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${selectedInvestment?.id === investment.id ? 'bg-accent' : ''}`}
                          onClick={() => handleInvestmentSelect(investment)}
                        >
                          <div className="font-medium">{investment.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(investment.date)}
                            {investment.investor && ` · ${investment.investor}`}
                          </div>
                          <div className="mt-1 font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(investment.amount)}
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investment expenses management */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedInvestment ? selectedInvestment.description : 'Расходы инвестиции'}
                    </CardTitle>
                    <CardDescription>
                      {selectedInvestment 
                        ? `Сумма инвестиции: ${formatCurrency(selectedInvestment.amount)}`
                        : 'Выберите инвестицию из списка слева'
                      }
                    </CardDescription>
                  </div>
                  {selectedInvestment && (
                    <Button onClick={handleAddExpense} disabled={isFormOpen}>
                      Добавить расход
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedInvestment ? (
                  <div>
                    {isFormOpen && (
                      <div className="mb-6">
                        <InvestmentExpenseForm 
                          investmentId={selectedInvestment.id}
                          onSuccess={handleFormSuccess}
                          onCancel={handleFormCancel}
                          isOpen={true}
                        />
                      </div>
                    )}
                    
                    <InvestmentExpensesList 
                      investmentId={selectedInvestment.id} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Выберите инвестицию для управления расходами
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestmentExpensesManagement;
