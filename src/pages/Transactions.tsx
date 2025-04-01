
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TransactionList from '@/components/transaction/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import TransferForm from '@/components/transaction/TransferForm';
import ReportDownloadDialog from '@/components/ReportDownloadDialog';
import FinancialReportDialog from '@/components/reports/FinancialReportDialog';
import ImportTransactionsDialog from '@/components/transaction/ImportTransactionsDialog';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Transactions = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"transaction" | "transfer">("transaction");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Транзакции</h1>
          {currentUser && (
            <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
              {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'})
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ReportDownloadDialog reportType="transactions" />
          <ReportDownloadDialog reportType="reimbursements" />
          <ReportDownloadDialog reportType="period" />
          <FinancialReportDialog />
          <ImportTransactionsDialog />
          <Link to="/advanced-analytics">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Продвинутая аналитика</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TransactionList />
          </div>
          <div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "transaction" | "transfer")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transaction">Доходы/Расходы</TabsTrigger>
                <TabsTrigger value="transfer">Переводы</TabsTrigger>
              </TabsList>
              <TabsContent value="transaction" className="mt-4">
                <TransactionForm />
              </TabsContent>
              <TabsContent value="transfer" className="mt-4">
                <TransferForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
