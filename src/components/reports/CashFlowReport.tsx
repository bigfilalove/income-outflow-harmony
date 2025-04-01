
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/transaction';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CashFlowReportProps {
  startDate?: Date;
  endDate?: Date;
  company?: string;
}

interface CompanyCashFlow {
  company: string;
  inflow: number;
  outflow: number;
  transfers: {
    incoming: number;
    outgoing: number;
  };
  balance: number;
}

const CashFlowReport: React.FC<CashFlowReportProps> = ({ startDate, endDate, company }) => {
  const { transactions } = useTransactions();
  const [cashFlows, setCashFlows] = useState<CompanyCashFlow[]>([]);
  
  useEffect(() => {
    // Filter transactions by date range and company if provided
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      const dateInRange = (!startDate || transactionDate >= startDate) && 
                          (!endDate || transactionDate <= endDate);
      
      const companyMatches = !company || 
                           transaction.company === company || 
                           transaction.fromCompany === company || 
                           transaction.toCompany === company;
      
      return dateInRange && companyMatches;
    });
    
    // Create a map to track cash flow by company
    const companyFlowMap: Record<string, CompanyCashFlow> = {};
    
    // Process all transactions
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income' || transaction.type === 'expense') {
        // Skip if no company
        if (!transaction.company) return;
        
        // Initialize company if not exists
        if (!companyFlowMap[transaction.company]) {
          companyFlowMap[transaction.company] = {
            company: transaction.company,
            inflow: 0,
            outflow: 0,
            transfers: { incoming: 0, outgoing: 0 },
            balance: 0
          };
        }
        
        // Add to appropriate flow
        if (transaction.type === 'income') {
          companyFlowMap[transaction.company].inflow += transaction.amount;
          companyFlowMap[transaction.company].balance += transaction.amount;
        } else {
          companyFlowMap[transaction.company].outflow += transaction.amount;
          companyFlowMap[transaction.company].balance -= transaction.amount;
        }
      } 
      // Handle transfers between companies
      else if (transaction.type === 'transfer' && transaction.isTransfer) {
        const fromCompany = transaction.fromCompany;
        const toCompany = transaction.toCompany;
        
        if (fromCompany) {
          // Initialize from company if not exists
          if (!companyFlowMap[fromCompany]) {
            companyFlowMap[fromCompany] = {
              company: fromCompany,
              inflow: 0,
              outflow: 0,
              transfers: { incoming: 0, outgoing: 0 },
              balance: 0
            };
          }
          
          // Add outgoing transfer
          companyFlowMap[fromCompany].transfers.outgoing += transaction.amount;
          companyFlowMap[fromCompany].balance -= transaction.amount;
        }
        
        if (toCompany) {
          // Initialize to company if not exists
          if (!companyFlowMap[toCompany]) {
            companyFlowMap[toCompany] = {
              company: toCompany,
              inflow: 0,
              outflow: 0,
              transfers: { incoming: 0, outgoing: 0 },
              balance: 0
            };
          }
          
          // Add incoming transfer
          companyFlowMap[toCompany].transfers.incoming += transaction.amount;
          companyFlowMap[toCompany].balance += transaction.amount;
        }
      }
    });
    
    // Convert map to array for display
    setCashFlows(Object.values(companyFlowMap));
    
  }, [transactions, startDate, endDate, company]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Отчет о движении денежных средств</CardTitle>
      </CardHeader>
      <CardContent>
        {startDate && endDate && (
          <p className="text-muted-foreground mb-4">
            Период: {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')}
          </p>
        )}
        
        {company && (
          <p className="text-muted-foreground mb-4">
            Компания: {company}
          </p>
        )}
        
        {cashFlows.length > 0 ? (
          <Table>
            <TableCaption>Отчет о движении денежных средств</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Компания</TableHead>
                <TableHead className="text-right">Приход</TableHead>
                <TableHead className="text-right">Расход</TableHead>
                <TableHead className="text-right">Вход. переводы</TableHead>
                <TableHead className="text-right">Исход. переводы</TableHead>
                <TableHead className="text-right">Баланс</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashFlows.map((flow) => (
                <TableRow key={flow.company}>
                  <TableCell className="font-medium">{flow.company}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(flow.inflow)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(flow.outflow)}</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(flow.transfers.incoming)}</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(flow.transfers.outgoing)}</TableCell>
                  <TableCell className={`text-right font-semibold ${flow.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(flow.balance)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">Общий баланс:</TableCell>
                <TableCell className={`text-right font-bold ${cashFlows.reduce((sum, flow) => sum + flow.balance, 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(cashFlows.reduce((sum, flow) => sum + flow.balance, 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground">Нет данных для отображения за выбранный период</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowReport;
