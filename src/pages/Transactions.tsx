
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/transaction/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import TransferForm from '@/components/transaction/TransferForm';
import InvestmentForm from '@/components/transaction/InvestmentForm';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import FinancialReportDialog from '@/components/reports/FinancialReportDialog';
import InvestmentReportDialog from '@/components/reports/InvestmentReportDialog';
import ImportTransactionsDialog from '@/components/transaction/ImportTransactionsDialog';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, Bug } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupabaseConnectionDebug from '@/components/debug/SupabaseConnectionDebug';
import { useTransactions } from '@/context/transaction';
import { useIsMobile } from '@/hooks/use-mobile';

const Transactions = () => {
  const { currentUser } = useAuth();
  const { error } = useTransactions();
  const [activeTab, setActiveTab] = useState<"transaction" | "transfer" | "investment">("transaction");
  const [showDebug, setShowDebug] = useState(false);
  const isMobile = useIsMobile();
  const [showForm, setShowForm] = useState(!isMobile);

  // Функция для переключения видимости формы на мобильных устройствах
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Транзакции</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm truncate max-w-[150px] sm:max-w-full">
              {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'})
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full">
            <ReportDownloadDialog reportType="transactions" />
            <ReportDownloadDialog reportType="reimbursements" />
            <ReportDownloadDialog reportType="period" />
            <FinancialReportDialog />
            <InvestmentReportDialog />
            <ImportTransactionsDialog />
            <Link to="/advanced-analytics">
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <BarChart3 className="h-4 w-4" />
                <span className="sm:inline hidden">Продвинутая аналитика</span>
                <span className="sm:hidden inline">Аналитика</span>
              </Button>
            </Link>
            
            {/* Debug button for development/troubleshooting */}
            {(process.env.NODE_ENV === 'development' || error) && (
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-auto" 
                onClick={() => setShowDebug(!showDebug)}
                title="Toggle Debug View"
              >
                <Bug className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isMobile && (
            <Button 
              onClick={toggleForm} 
              className="w-full mt-2"
              variant="outline"
            >
              {showForm ? "Скрыть форму" : "Показать форму"}
            </Button>
          )}
        </div>
        
        {/* Debug panel */}
        {showDebug && (
          <div className="mb-6">
            <SupabaseConnectionDebug />
          </div>
        )}
        
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          <div className={isMobile && showForm ? "hidden" : "md:col-span-2"}>
            <TransactionList />
          </div>
          {(!isMobile || showForm) && (
            <div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "transaction" | "transfer" | "investment")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="transaction">Доходы/Расходы</TabsTrigger>
                  <TabsTrigger value="transfer">Переводы</TabsTrigger>
                  <TabsTrigger value="investment">Инвестиции</TabsTrigger>
                </TabsList>
                <TabsContent value="transaction" className="mt-4">
                  <TransactionForm />
                </TabsContent>
                <TabsContent value="transfer" className="mt-4">
                  <TransferForm />
                </TabsContent>
                <TabsContent value="investment" className="mt-4">
                  <InvestmentForm />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
