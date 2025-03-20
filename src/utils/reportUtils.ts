
import { Transaction } from '@/types/transaction';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDateShort } from '@/lib/formatters';

// Helper function to filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Excel report generation
export const generateExcelReport = (
  data: any[],
  sheetName: string,
  fileName: string
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Convert to array buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  // Save file
  saveAs(blob, `${fileName}.xlsx`);
};

// PDF report generation
export const generatePdfReport = (
  title: string,
  headers: string[],
  data: any[][],
  fileName: string
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Сформировано: ${new Date().toLocaleDateString('ru-RU')}`, 14, 22);
  
  // Create table
  (doc as any).autoTable({
    head: [headers],
    body: data,
    startY: 25,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Save PDF
  doc.save(`${fileName}.pdf`);
};

// Prepare transaction data for reports
export const prepareTransactionDataForExcel = (transactions: Transaction[]) => {
  return transactions.map(t => ({
    'Описание': t.description,
    'Категория': t.category,
    'Сумма': formatCurrency(t.amount),
    'Дата': formatDateShort(t.date),
    'Тип': t.type === 'income' ? 'Доход' : t.type === 'expense' ? 'Расход' : 'Возмещение',
    'Возмещение сотруднику': t.reimbursedTo || 'Н/Д',
    'Статус': t.reimbursementStatus ? 
      (t.reimbursementStatus === 'pending' ? 'Ожидает' : 'Выполнено') : 'Н/Д'
  }));
};

// Prepare reimbursement data for reports
export const prepareReimbursementDataForExcel = (transactions: Transaction[]) => {
  const reimbursements = transactions.filter(t => t.isReimbursement);
  
  return reimbursements.map(t => ({
    'Описание': t.description,
    'Категория': t.category,
    'Сумма': formatCurrency(t.amount),
    'Дата': formatDateShort(t.date),
    'Сотрудник': t.reimbursedTo || 'Неизвестно',
    'Статус': t.reimbursementStatus === 'pending' ? 'Ожидает' : 'Выполнено'
  }));
};

// Prepare transactions for PDF format
export const prepareTransactionDataForPdf = (transactions: Transaction[]) => {
  return transactions.map(t => [
    t.description,
    t.category,
    formatCurrency(t.amount),
    formatDateShort(t.date),
    t.type === 'income' ? 'Доход' : t.type === 'expense' ? 'Расход' : 'Возмещение',
    t.reimbursedTo || 'Н/Д',
    t.reimbursementStatus ? 
      (t.reimbursementStatus === 'pending' ? 'Ожидает' : 'Выполнено') : 'Н/Д'
  ]);
};

// Prepare reimbursements for PDF format
export const prepareReimbursementDataForPdf = (transactions: Transaction[]) => {
  const reimbursements = transactions.filter(t => t.isReimbursement);
  
  return reimbursements.map(t => [
    t.description,
    t.category,
    formatCurrency(t.amount),
    formatDateShort(t.date),
    t.reimbursedTo || 'Неизвестно',
    t.reimbursementStatus === 'pending' ? 'Ожидает' : 'Выполнено'
  ]);
};

// Prepare analytics data for reports
export const prepareAnalyticsDataForExcel = (transactions: Transaction[]) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalReimbursements = transactions
    .filter(t => t.isReimbursement)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const pendingReimbursements = transactions
    .filter(t => t.isReimbursement && t.reimbursementStatus === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get category data
  const categoryTotals = transactions.reduce((acc, t) => {
    const categoryKey = `${t.type}_${t.category}`;
    acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Create report data
  const summary = [
    { 'Показатель': 'Общий доход', 'Значение': formatCurrency(totalIncome) },
    { 'Показатель': 'Общий расход', 'Значение': formatCurrency(totalExpense) },
    { 'Показатель': 'Баланс', 'Значение': formatCurrency(totalIncome - totalExpense) },
    { 'Показатель': 'Всего возмещений', 'Значение': formatCurrency(totalReimbursements) },
    { 'Показатель': 'Ожидающие возмещения', 'Значение': formatCurrency(pendingReimbursements) }
  ];
  
  // Category breakdown
  const categoryBreakdown = Object.entries(categoryTotals).map(([key, value]) => {
    const [type, ...categoryParts] = key.split('_');
    const category = categoryParts.join('_');
    return {
      'Тип': type === 'income' ? 'Доход' : type === 'expense' ? 'Расход' : 'Возмещение',
      'Категория': category,
      'Сумма': formatCurrency(value)
    };
  });
  
  return { summary, categoryBreakdown };
};

// Prepare analytics data for PDF format
export const prepareAnalyticsDataForPdf = (transactions: Transaction[]) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalReimbursements = transactions
    .filter(t => t.isReimbursement)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const pendingReimbursements = transactions
    .filter(t => t.isReimbursement && t.reimbursementStatus === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Create summary data
  const summaryData = [
    ['Общий доход', formatCurrency(totalIncome)],
    ['Общий расход', formatCurrency(totalExpense)],
    ['Баланс', formatCurrency(totalIncome - totalExpense)],
    ['Всего возмещений', formatCurrency(totalReimbursements)],
    ['Ожидающие возмещения', formatCurrency(pendingReimbursements)]
  ];
  
  return summaryData;
};
