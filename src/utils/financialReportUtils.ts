
import { Transaction } from "@/types/transaction";
import { saveAs } from 'file-saver';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from "@/lib/formatters";
import { formatDate } from "@/lib/date-utils";

interface ReportOptions {
  reportType: 'profit-loss' | 'balance-sheet' | 'cash-flow';
  format: 'pdf' | 'excel';
  startDate: Date;
  endDate: Date;
  transactions: Transaction[];
}

// Helper to get report title based on type
const getReportTitle = (reportType: string): string => {
  switch (reportType) {
    case 'profit-loss':
      return 'Отчет о прибылях и убытках';
    case 'balance-sheet':
      return 'Балансовый отчет';
    case 'cash-flow':
      return 'Отчет о движении денежных средств';
    default:
      return 'Финансовый отчет';
  }
};

// Process transactions for profit-loss report
const processProfitLossData = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  const categories: Record<string, { income: number; expense: number }> = {};
  
  // Filter transactions by date range
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
  
  // Process transactions into categories
  filteredTransactions.forEach(transaction => {
    const { category, type, amount } = transaction;
    
    if (!categories[category]) {
      categories[category] = { income: 0, expense: 0 };
    }
    
    if (type === 'income') {
      categories[category].income += amount;
    } else if (type === 'expense') {
      categories[category].expense += amount;
    }
  });
  
  // Calculate totals
  const totalIncome = Object.values(categories).reduce((sum, item) => sum + item.income, 0);
  const totalExpense = Object.values(categories).reduce((sum, item) => sum + item.expense, 0);
  const netProfit = totalIncome - totalExpense;
  
  // Convert to array for easier rendering
  const categoryData = Object.entries(categories).map(([category, data]) => ({
    category,
    income: data.income,
    expense: data.expense,
    balance: data.income - data.expense
  }));
  
  return {
    categories: categoryData,
    totalIncome,
    totalExpense,
    netProfit
  };
};

// Process transactions for balance sheet report
const processBalanceSheetData = (transactions: Transaction[], endDate: Date) => {
  // Filter transactions up to the end date
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate <= endDate;
  });
  
  // Calculate assets by company
  const assets: Record<string, number> = {};
  
  filteredTransactions.forEach(transaction => {
    const { company, type, amount } = transaction;
    
    if (!company) return;
    
    if (!assets[company]) {
      assets[company] = 0;
    }
    
    if (type === 'income') {
      assets[company] += amount;
    } else if (type === 'expense') {
      assets[company] -= amount;
    }
  });
  
  // Convert to array for easier rendering
  const assetsData = Object.entries(assets)
    .map(([company, balance]) => ({
      company,
      balance
    }))
    .sort((a, b) => b.balance - a.balance);
  
  const totalAssets = assetsData.reduce((sum, item) => sum + (item.balance > 0 ? item.balance : 0), 0);
  const totalLiabilities = assetsData.reduce((sum, item) => sum + (item.balance < 0 ? -item.balance : 0), 0);
  
  return {
    assets: assetsData,
    totalAssets,
    totalLiabilities,
    equity: totalAssets - totalLiabilities
  };
};

// Process transactions for cash flow report
const processCashFlowData = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  // Filter transactions by date range
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
  
  // Process cash flow by company
  const companyCashFlow: Record<string, {
    inflow: number;
    outflow: number;
    transfers: { incoming: number; outgoing: number };
    balance: number;
  }> = {};
  
  filteredTransactions.forEach(transaction => {
    if (transaction.type === 'income' || transaction.type === 'expense') {
      if (!transaction.company) return;
      
      if (!companyCashFlow[transaction.company]) {
        companyCashFlow[transaction.company] = {
          inflow: 0,
          outflow: 0,
          transfers: { incoming: 0, outgoing: 0 },
          balance: 0
        };
      }
      
      if (transaction.type === 'income') {
        companyCashFlow[transaction.company].inflow += transaction.amount;
        companyCashFlow[transaction.company].balance += transaction.amount;
      } else {
        companyCashFlow[transaction.company].outflow += transaction.amount;
        companyCashFlow[transaction.company].balance -= transaction.amount;
      }
    } 
    else if (transaction.type === 'transfer' && transaction.isTransfer) {
      const fromCompany = transaction.fromCompany;
      const toCompany = transaction.toCompany;
      
      if (fromCompany) {
        if (!companyCashFlow[fromCompany]) {
          companyCashFlow[fromCompany] = {
            inflow: 0,
            outflow: 0,
            transfers: { incoming: 0, outgoing: 0 },
            balance: 0
          };
        }
        
        companyCashFlow[fromCompany].transfers.outgoing += transaction.amount;
        companyCashFlow[fromCompany].balance -= transaction.amount;
      }
      
      if (toCompany) {
        if (!companyCashFlow[toCompany]) {
          companyCashFlow[toCompany] = {
            inflow: 0,
            outflow: 0,
            transfers: { incoming: 0, outgoing: 0 },
            balance: 0
          };
        }
        
        companyCashFlow[toCompany].transfers.incoming += transaction.amount;
        companyCashFlow[toCompany].balance += transaction.amount;
      }
    }
  });
  
  // Convert to array for easier rendering
  const cashFlowData = Object.entries(companyCashFlow).map(([company, data]) => ({
    company,
    ...data
  }));
  
  const totalBalance = cashFlowData.reduce((sum, item) => sum + item.balance, 0);
  
  return {
    cashFlow: cashFlowData,
    totalBalance
  };
};

// Generate Excel file
const generateExcelReport = (options: ReportOptions) => {
  const { reportType, startDate, endDate, transactions } = options;
  const title = getReportTitle(reportType);
  const period = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  
  let data: any[] = [];
  
  if (reportType === 'profit-loss') {
    const report = processProfitLossData(transactions, startDate, endDate);
    
    data = [
      ['Категория', 'Доходы', 'Расходы', 'Баланс'],
      ...report.categories.map(item => [
        item.category,
        formatCurrency(item.income),
        formatCurrency(item.expense),
        formatCurrency(item.balance)
      ]),
      ['Итого:', formatCurrency(report.totalIncome), formatCurrency(report.totalExpense), formatCurrency(report.netProfit)]
    ];
  } 
  else if (reportType === 'balance-sheet') {
    const report = processBalanceSheetData(transactions, endDate);
    
    data = [
      ['Компания', 'Баланс'],
      ...report.assets.map(item => [
        item.company,
        formatCurrency(item.balance)
      ]),
      ['Итого активы:', formatCurrency(report.totalAssets)],
      ['Итого обязательства:', formatCurrency(report.totalLiabilities)],
      ['Капитал:', formatCurrency(report.equity)]
    ];
  } 
  else if (reportType === 'cash-flow') {
    const report = processCashFlowData(transactions, startDate, endDate);
    
    data = [
      ['Компания', 'Приходы', 'Расходы', 'Вход. переводы', 'Исход. переводы', 'Баланс'],
      ...report.cashFlow.map(item => [
        item.company,
        formatCurrency(item.inflow),
        formatCurrency(item.outflow),
        formatCurrency(item.transfers.incoming),
        formatCurrency(item.transfers.outgoing),
        formatCurrency(item.balance)
      ]),
      ['Итого:', '', '', '', '', formatCurrency(report.totalBalance)]
    ];
  }
  
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Report');
  
  // Add header with title and period
  utils.sheet_add_aoa(ws, [[title], [period]], { origin: 'A1' });
  
  // Adjust columns width
  const colWidths = [
    { wch: 30 }, // Company / Category
    { wch: 15 }, // Data 1
    { wch: 15 }, // Data 2
    { wch: 15 }, // Data 3
    { wch: 15 }, // Data 4
    { wch: 15 }, // Data 5
  ];
  ws['!cols'] = colWidths;
  
  writeFile(wb, `${title} ${period}.xlsx`);
};

// Generate PDF report
const generatePdfReport = (options: ReportOptions) => {
  const { reportType, startDate, endDate, transactions } = options;
  const title = getReportTitle(reportType);
  const period = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  
  const doc = new jsPDF();
  
  // Add title and period
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(12);
  doc.text(period, 14, 22);
  
  if (reportType === 'profit-loss') {
    const report = processProfitLossData(transactions, startDate, endDate);
    
    autoTable(doc, {
      startY: 30,
      head: [['Категория', 'Доходы', 'Расходы', 'Баланс']],
      body: [
        ...report.categories.map(item => [
          item.category,
          formatCurrency(item.income),
          formatCurrency(item.expense),
          formatCurrency(item.balance)
        ]),
        ['Итого:', formatCurrency(report.totalIncome), formatCurrency(report.totalExpense), formatCurrency(report.netProfit)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [70, 70, 70] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
  } 
  else if (reportType === 'balance-sheet') {
    const report = processBalanceSheetData(transactions, endDate);
    
    autoTable(doc, {
      startY: 30,
      head: [['Компания', 'Баланс']],
      body: [
        ...report.assets.map(item => [
          item.company,
          formatCurrency(item.balance)
        ]),
        ['Итого активы:', formatCurrency(report.totalAssets)],
        ['Итого обязательства:', formatCurrency(report.totalLiabilities)],
        ['Капитал:', formatCurrency(report.equity)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [70, 70, 70] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
  } 
  else if (reportType === 'cash-flow') {
    const report = processCashFlowData(transactions, startDate, endDate);
    
    autoTable(doc, {
      startY: 30,
      head: [['Компания', 'Приходы', 'Расходы', 'Вх. переводы', 'Исх. переводы', 'Баланс']],
      body: [
        ...report.cashFlow.map(item => [
          item.company,
          formatCurrency(item.inflow),
          formatCurrency(item.outflow),
          formatCurrency(item.transfers.incoming),
          formatCurrency(item.transfers.outgoing),
          formatCurrency(item.balance)
        ]),
        ['Итого:', '', '', '', '', formatCurrency(report.totalBalance)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [70, 70, 70] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
  }
  
  doc.save(`${title} ${period}.pdf`);
};

export const generateFinancialReport = (options: ReportOptions) => {
  if (options.format === 'excel') {
    generateExcelReport(options);
  } else {
    generatePdfReport(options);
  }
};
