
import { Transaction } from '@/types/transaction';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '@/lib/formatters';
import { filterTransactionsByDateRange } from './reportUtils';

type ReportType = 'profit-loss' | 'balance-sheet' | 'cash-flow';
type ExportFormat = 'pdf' | 'excel';

interface GenerateFinancialReportParams {
  reportType: ReportType;
  format: ExportFormat;
  startDate: Date;
  endDate: Date;
  transactions: Transaction[];
}

// Функция для генерации финансовых отчетов
export const generateFinancialReport = ({
  reportType,
  format,
  startDate,
  endDate,
  transactions
}: GenerateFinancialReportParams) => {
  const filteredTransactions = filterTransactionsByDateRange(transactions, startDate, endDate);
  const periodString = `${startDate.toLocaleDateString('ru-RU')}-${endDate.toLocaleDateString('ru-RU')}`;
  
  switch (reportType) {
    case 'profit-loss':
      if (format === 'excel') {
        generateProfitLossExcel(filteredTransactions, periodString);
      } else {
        generateProfitLossPdf(filteredTransactions, periodString);
      }
      break;
    case 'balance-sheet':
      if (format === 'excel') {
        generateBalanceSheetExcel(filteredTransactions, periodString);
      } else {
        generateBalanceSheetPdf(filteredTransactions, periodString);
      }
      break;
    case 'cash-flow':
      if (format === 'excel') {
        generateCashFlowExcel(filteredTransactions, periodString);
      } else {
        generateCashFlowPdf(filteredTransactions, periodString);
      }
      break;
  }
};

// Отчет о прибылях и убытках в Excel
const generateProfitLossExcel = (transactions: Transaction[], periodString: string) => {
  // Расчет данных для отчета
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const totalIncome = Object.values(incomeByCategory).reduce((sum, val) => sum + val, 0);
  const totalExpense = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);
  const netProfit = totalIncome - totalExpense;
  
  // Подготовка данных для Excel
  const incomeData = Object.entries(incomeByCategory).map(([category, amount]) => ({
    'Категория': category,
    'Сумма': formatCurrency(amount)
  }));
  
  const expenseData = Object.entries(expenseByCategory).map(([category, amount]) => ({
    'Категория': category,
    'Сумма': formatCurrency(amount)
  }));
  
  // Суммарные строки
  const summaryData = [
    { 'Категория': 'Итого доходы', 'Сумма': formatCurrency(totalIncome) },
    { 'Категория': 'Итого расходы', 'Сумма': formatCurrency(totalExpense) },
    { 'Категория': 'Чистая прибыль', 'Сумма': formatCurrency(netProfit) }
  ];
  
  // Создание книги Excel
  const workbook = XLSX.utils.book_new();
  
  // Лист доходов
  if (incomeData.length > 0) {
    const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Доходы');
  }
  
  // Лист расходов
  if (expenseData.length > 0) {
    const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Расходы');
  }
  
  // Лист с итогами
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Итоги');
  
  // Сохранение файла
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });
  saveAs(blob, `Отчет_о_прибылях_и_убытках_${periodString}.xlsx`);
};

// Отчет о прибылях и убытках в PDF
const generateProfitLossPdf = (transactions: Transaction[], periodString: string) => {
  // Расчет данных для отчета (аналогично Excel)
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const totalIncome = Object.values(incomeByCategory).reduce((sum, val) => sum + val, 0);
  const totalExpense = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);
  const netProfit = totalIncome - totalExpense;
  
  // Подготовка данных для PDF
  const doc = new jsPDF();
  
  // Заголовок
  doc.setFontSize(18);
  doc.text('Отчет о прибылях и убытках', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Период: ${periodString}`, 14, 30);
  
  // Таблица доходов
  const incomeData = Object.entries(incomeByCategory).map(([category, amount]) => [
    category, formatCurrency(amount)
  ]);
  
  const expenseData = Object.entries(expenseByCategory).map(([category, amount]) => [
    category, formatCurrency(amount)
  ]);
  
  // Доходы
  doc.setFontSize(14);
  doc.text('Доходы', 14, 40);
  
  (doc as any).autoTable({
    startY: 45,
    head: [['Категория', 'Сумма']],
    body: [
      ...incomeData,
      ['Итого доходы', formatCurrency(totalIncome)]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    },
    foot: [['Итого доходы', formatCurrency(totalIncome)]],
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Расходы
  const expenseY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Расходы', 14, expenseY);
  
  (doc as any).autoTable({
    startY: expenseY + 5,
    head: [['Категория', 'Сумма']],
    body: [
      ...expenseData,
      ['Итого расходы', formatCurrency(totalExpense)]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    },
    foot: [['Итого расходы', formatCurrency(totalExpense)]],
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Чистая прибыль
  const summaryY = (doc as any).lastAutoTable.finalY + 15;
  
  (doc as any).autoTable({
    startY: summaryY,
    body: [
      ['Чистая прибыль', formatCurrency(netProfit)]
    ],
    theme: 'plain',
    styles: { 
      fontStyle: 'bold',
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });
  
  // Сохранение файла
  doc.save(`Отчет_о_прибылях_и_убытках_${periodString}.pdf`);
};

// Балансовый отчет в Excel
const generateBalanceSheetExcel = (transactions: Transaction[], periodString: string) => {
  // Расчет общих сумм
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const cashBalance = totalIncome - totalExpense;
  
  // Расчет активов по компаниям
  const companyAssets = transactions.reduce((acc, t) => {
    const companyName = t.company || 'Не указана';
    if (!acc[companyName]) {
      acc[companyName] = 0;
    }
    
    if (t.type === 'income') {
      acc[companyName] += t.amount;
    } else if (t.type === 'expense') {
      acc[companyName] -= t.amount;
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  // Преобразование в массивы для отчета
  const assets = Object.entries(companyAssets)
    .filter(([_, amount]) => amount > 0)
    .map(([company, amount]) => ({
      'Статья': company,
      'Сумма': formatCurrency(amount)
    }));
    
  const liabilities = Object.entries(companyAssets)
    .filter(([_, amount]) => amount < 0)
    .map(([company, amount]) => ({
      'Статья': `Задолженность: ${company}`,
      'Сумма': formatCurrency(Math.abs(amount))
    }));
  
  // Добавление денежных средств
  if (cashBalance > 0) {
    assets.unshift({
      'Статья': 'Денежные средства',
      'Сумма': formatCurrency(cashBalance)
    });
  } else if (cashBalance < 0) {
    liabilities.unshift({
      'Статья': 'Овердрафт',
      'Сумма': formatCurrency(Math.abs(cashBalance))
    });
  }
  
  // Расчет итогов
  const totalAssets = cashBalance > 0 ? cashBalance : 0 + 
    Object.entries(companyAssets)
      .filter(([_, amount]) => amount > 0)
      .reduce((sum, [_, amount]) => sum + amount, 0);
      
  const totalLiabilities = cashBalance < 0 ? Math.abs(cashBalance) : 0 + 
    Object.entries(companyAssets)
      .filter(([_, amount]) => amount < 0)
      .reduce((sum, [_, amount]) => sum + Math.abs(amount), 0);
      
  const equity = totalAssets - totalLiabilities;
  
  // Итоговые данные
  const summaryData = [
    { 'Статья': 'Итого активы', 'Сумма': formatCurrency(totalAssets) },
    { 'Статья': 'Итого обязательства', 'Сумма': formatCurrency(totalLiabilities) },
    { 'Статья': 'Собственный капитал', 'Сумма': formatCurrency(equity) }
  ];
  
  // Создание книги Excel
  const workbook = XLSX.utils.book_new();
  
  // Лист активов
  if (assets.length > 0) {
    const assetsSheet = XLSX.utils.json_to_sheet(assets);
    XLSX.utils.book_append_sheet(workbook, assetsSheet, 'Активы');
  }
  
  // Лист обязательств
  if (liabilities.length > 0) {
    const liabilitiesSheet = XLSX.utils.json_to_sheet(liabilities);
    XLSX.utils.book_append_sheet(workbook, liabilitiesSheet, 'Обязательства');
  }
  
  // Лист с итогами
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Итоги');
  
  // Сохранение файла
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });
  saveAs(blob, `Балансовый_отчет_${periodString}.xlsx`);
};

// Балансовый отчет в PDF
const generateBalanceSheetPdf = (transactions: Transaction[], periodString: string) => {
  // Расчет данных (аналогично Excel)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const cashBalance = totalIncome - totalExpense;
  
  // Расчет активов по компаниям
  const companyAssets = transactions.reduce((acc, t) => {
    const companyName = t.company || 'Не указана';
    if (!acc[companyName]) {
      acc[companyName] = 0;
    }
    
    if (t.type === 'income') {
      acc[companyName] += t.amount;
    } else if (t.type === 'expense') {
      acc[companyName] -= t.amount;
    }
    
    return acc;
  }, {} as Record<string, number>);
  
  // Подготовка данных для PDF
  const assetsData = Object.entries(companyAssets)
    .filter(([_, amount]) => amount > 0)
    .map(([company, amount]) => [
      company, formatCurrency(amount)
    ]);
    
  const liabilitiesData = Object.entries(companyAssets)
    .filter(([_, amount]) => amount < 0)
    .map(([company, amount]) => [
      `Задолженность: ${company}`, formatCurrency(Math.abs(amount))
    ]);
  
  // Добавление денежных средств
  if (cashBalance > 0) {
    assetsData.unshift(['Денежные средства', formatCurrency(cashBalance)]);
  } else if (cashBalance < 0) {
    liabilitiesData.unshift(['Овердрафт', formatCurrency(Math.abs(cashBalance))]);
  }
  
  // Расчет итогов
  const totalAssets = cashBalance > 0 ? cashBalance : 0 + 
    Object.entries(companyAssets)
      .filter(([_, amount]) => amount > 0)
      .reduce((sum, [_, amount]) => sum + amount, 0);
      
  const totalLiabilities = cashBalance < 0 ? Math.abs(cashBalance) : 0 + 
    Object.entries(companyAssets)
      .filter(([_, amount]) => amount < 0)
      .reduce((sum, [_, amount]) => sum + Math.abs(amount), 0);
      
  const equity = totalAssets - totalLiabilities;
  
  // Создание PDF
  const doc = new jsPDF();
  
  // Заголовок
  doc.setFontSize(18);
  doc.text('Балансовый отчет', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Период: ${periodString}`, 14, 30);
  
  // Активы
  doc.setFontSize(14);
  doc.text('Активы', 14, 40);
  
  (doc as any).autoTable({
    startY: 45,
    head: [['Статья', 'Сумма']],
    body: assetsData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    },
    foot: [['Итого активы', formatCurrency(totalAssets)]],
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Обязательства
  const liabilitiesY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Обязательства', 14, liabilitiesY);
  
  (doc as any).autoTable({
    startY: liabilitiesY + 5,
    head: [['Статья', 'Сумма']],
    body: liabilitiesData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    },
    foot: [['Итого обязательства', formatCurrency(totalLiabilities)]],
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Собственный капитал
  const equityY = (doc as any).lastAutoTable.finalY + 15;
  
  (doc as any).autoTable({
    startY: equityY,
    body: [
      ['Собственный капитал', formatCurrency(equity)]
    ],
    theme: 'plain',
    styles: { 
      fontStyle: 'bold',
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });
  
  // Сохранение файла
  doc.save(`Балансовый_отчет_${periodString}.pdf`);
};

// Отчет о движении денежных средств в Excel
const generateCashFlowExcel = (transactions: Transaction[], periodString: string) => {
  // Группировка транзакций по месяцам
  const months: Record<string, { 
    monthName: string, 
    income: number, 
    expense: number, 
    balance: number 
  }> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    
    if (!months[monthKey]) {
      months[monthKey] = {
        monthName,
        income: 0,
        expense: 0,
        balance: 0
      };
    }
    
    if (transaction.type === 'income') {
      months[monthKey].income += transaction.amount;
      months[monthKey].balance += transaction.amount;
    } else if (transaction.type === 'expense') {
      months[monthKey].expense += transaction.amount;
      months[monthKey].balance -= transaction.amount;
    }
  });
  
  // Сортировка месяцев
  const sortedMonths = Object.values(months).sort((a, b) => {
    return a.monthName.localeCompare(b.monthName);
  });
  
  // Подготовка данных по месяцам
  const monthlyData = sortedMonths.map(month => ({
    'Месяц': month.monthName,
    'Поступления': formatCurrency(month.income),
    'Расходы': formatCurrency(month.expense),
    'Баланс': formatCurrency(month.balance)
  }));
  
  // Расчет итогов
  const totalIncome = sortedMonths.reduce((sum, month) => sum + month.income, 0);
  const totalExpense = sortedMonths.reduce((sum, month) => sum + month.expense, 0);
  const netCashFlow = totalIncome - totalExpense;
  
  // Упрощенная категоризация для примера
  const operatingCategories = ['Продажи', 'Зарплаты', 'Аренда', 'Коммунальные услуги', 'Налоги', 'Другое'];
  const investingCategories = ['Инвестиции', 'Оборудование'];
  const financingCategories = ['Кредиты'];
  
  const operating = transactions
    .filter(t => operatingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
    
  const investing = transactions
    .filter(t => investingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
    
  const financing = transactions
    .filter(t => financingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
  
  // Итоговые данные
  const summaryData = [
    { 'Вид деятельности': 'Операционная деятельность', 'Сумма': formatCurrency(operating) },
    { 'Вид деятельности': 'Инвестиционная деятельность', 'Сумма': formatCurrency(investing) },
    { 'Вид деятельности': 'Финансовая деятельность', 'Сумма': formatCurrency(financing) },
    { 'Вид деятельности': 'Чистый денежный поток', 'Сумма': formatCurrency(netCashFlow) }
  ];
  
  // Создание книги Excel
  const workbook = XLSX.utils.book_new();
  
  // Лист с данными по месяцам
  if (monthlyData.length > 0) {
    const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'По месяцам');
  }
  
  // Лист с итогами по видам деятельности
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'По видам деятельности');
  
  // Сохранение файла
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });
  saveAs(blob, `Отчет_о_движении_денежных_средств_${periodString}.xlsx`);
};

// Отчет о движении денежных средств в PDF
const generateCashFlowPdf = (transactions: Transaction[], periodString: string) => {
  // Группировка транзакций по месяцам (аналогично Excel)
  const months: Record<string, { 
    monthName: string, 
    income: number, 
    expense: number, 
    balance: number 
  }> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    
    if (!months[monthKey]) {
      months[monthKey] = {
        monthName,
        income: 0,
        expense: 0,
        balance: 0
      };
    }
    
    if (transaction.type === 'income') {
      months[monthKey].income += transaction.amount;
      months[monthKey].balance += transaction.amount;
    } else if (transaction.type === 'expense') {
      months[monthKey].expense += transaction.amount;
      months[monthKey].balance -= transaction.amount;
    }
  });
  
  // Сортировка месяцев
  const sortedMonths = Object.values(months).sort((a, b) => {
    return a.monthName.localeCompare(b.monthName);
  });
  
  // Подготовка данных для PDF
  const monthlyData = sortedMonths.map(month => [
    month.monthName,
    formatCurrency(month.income),
    formatCurrency(month.expense),
    formatCurrency(month.balance)
  ]);
  
  // Расчет итогов
  const totalIncome = sortedMonths.reduce((sum, month) => sum + month.income, 0);
  const totalExpense = sortedMonths.reduce((sum, month) => sum + month.expense, 0);
  const netCashFlow = totalIncome - totalExpense;
  
  // Упрощенная категоризация для примера
  const operatingCategories = ['Продажи', 'Зарплаты', 'Аренда', 'Коммунальные услуги', 'Налоги', 'Другое'];
  const investingCategories = ['Инвестиции', 'Оборудование'];
  const financingCategories = ['Кредиты'];
  
  const operating = transactions
    .filter(t => operatingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
    
  const investing = transactions
    .filter(t => investingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
    
  const financing = transactions
    .filter(t => financingCategories.includes(t.category))
    .reduce((total, t) => {
      return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
  
  // Создание PDF
  const doc = new jsPDF();
  
  // Заголовок
  doc.setFontSize(18);
  doc.text('Отчет о движении денежных средств', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Период: ${periodString}`, 14, 30);
  
  // Таблица с видами деятельности
  doc.setFontSize(14);
  doc.text('По видам деятельности', 14, 40);
  
  (doc as any).autoTable({
    startY: 45,
    head: [['Вид деятельности', 'Сумма']],
    body: [
      ['Операционная деятельность', formatCurrency(operating)],
      ['Инвестиционная деятельность', formatCurrency(investing)],
      ['Финансовая деятельность', formatCurrency(financing)],
      ['Чистый денежный поток', formatCurrency(netCashFlow)]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });
  
  // Таблица по месяцам
  const monthlyY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('По месяцам', 14, monthlyY);
  
  (doc as any).autoTable({
    startY: monthlyY + 5,
    head: [['Месяц', 'Поступления', 'Расходы', 'Баланс']],
    body: monthlyData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    },
    foot: [['Итого', formatCurrency(totalIncome), formatCurrency(totalExpense), formatCurrency(netCashFlow)]],
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Сохранение файла
  doc.save(`Отчет_о_движении_денежных_средств_${periodString}.pdf`);
};
