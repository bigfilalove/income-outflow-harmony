
import { Transaction } from '@/types/transaction';
import { InvestmentSummary, CompanySpendingSummary } from './types';

export const determineInvestor = (transaction: Transaction): string => {
  let investor = '';
  
  // First priority: explicit investor field (for transactions created via investment form)
  if (transaction.isInvestment && transaction.investor) {
    investor = transaction.investor;
  } 
  // Second priority: extract investor name from description for specific categories
  else if (transaction.category === 'Вклад собственника' || transaction.category === 'Инвестиции партнера') {
    // Check various description formats
    if (transaction.description.includes(' от ')) {
      investor = transaction.description.split(' от ')[1] || '';
    } else if (transaction.description.includes(' - ')) {
      investor = transaction.description.split(' - ')[1] || '';
    } else if (transaction.description.includes(':')) {
      investor = transaction.description.split(':')[1]?.trim() || '';
    }
  }
    
  // If we still couldn't determine the investor, use "Неуказанный инвестор"
  if (!investor) {
    investor = 'Неуказанный инвестор';
  }
  
  return investor;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
};

export const processTransactions = (
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date,
  filterCompany?: string,
  filterInvestor?: string,
  sortByInvestment: 'asc' | 'desc' = 'desc',
  sortBySpending: 'asc' | 'desc' = 'desc'
): {
  investmentsByInvestor: InvestmentSummary[];
  spendingByCompany: CompanySpendingSummary[];
} => {
  // Filter transactions based on date range and other filters
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    
    const dateInRange = (!startDate || transactionDate >= startDate) && 
                        (!endDate || transactionDate <= endDate);
    
    const matchesCompanyFilter = !filterCompany || transaction.company === filterCompany;
    const matchesInvestorFilter = !filterInvestor || 
                                 (transaction.isInvestment && transaction.investor === filterInvestor) ||
                                 (transaction.category === 'Вклад собственника' && transaction.description.includes(filterInvestor));
    
    // Include all transactions with isInvestment=true, as well as transactions with category "Вклад собственника" or "Инвестиции партнера"
    const isInvestmentTransaction = transaction.isInvestment || 
                                   transaction.category === 'Вклад собственника' ||
                                   transaction.category === 'Инвестиции партнера';
    
    return dateInRange && matchesCompanyFilter && isInvestmentTransaction && 
          (matchesInvestorFilter || !filterInvestor);
  });
  
  console.log("Filtered transactions for investment report:", filteredTransactions);
  
  // Calculate investments by investor
  const investmentMap: Record<string, InvestmentSummary> = {};
  
  filteredTransactions.forEach(transaction => {
    const investor = determineInvestor(transaction);
    
    if (transaction.company) {
      if (!investmentMap[investor]) {
        investmentMap[investor] = {
          investor,
          totalInvested: 0,
          companies: {}
        };
      }
      
      investmentMap[investor].totalInvested += transaction.amount;
      
      const company = transaction.company;
      if (!investmentMap[investor].companies[company]) {
        investmentMap[investor].companies[company] = 0;
      }
      
      investmentMap[investor].companies[company] += transaction.amount;
    }
  });
  
  // Convert to array and sort
  const investmentArray = Object.values(investmentMap).sort((a, b) => {
    return sortByInvestment === 'desc' 
      ? b.totalInvested - a.totalInvested 
      : a.totalInvested - b.totalInvested;
  });
  
  // Calculate spending by company
  const spendingMap: Record<string, CompanySpendingSummary> = {};
  
  filteredTransactions.forEach(transaction => {
    if (transaction.type === 'expense' && transaction.company) {
      const company = transaction.company;
      
      if (!spendingMap[company]) {
        spendingMap[company] = {
          company,
          totalSpent: 0,
          categories: {}
        };
      }
      
      spendingMap[company].totalSpent += transaction.amount;
      
      const category = transaction.category;
      if (!spendingMap[company].categories[category]) {
        spendingMap[company].categories[category] = 0;
      }
      
      spendingMap[company].categories[category] += transaction.amount;
    }
  });
  
  // Convert to array and sort
  const spendingArray = Object.values(spendingMap).sort((a, b) => {
    return sortBySpending === 'desc' 
      ? b.totalSpent - a.totalSpent 
      : a.totalSpent - b.totalSpent;
  });
  
  return {
    investmentsByInvestor: investmentArray,
    spendingByCompany: spendingArray
  };
};

export const generateExcelData = (investmentsByInvestor: InvestmentSummary[], spendingByCompany: CompanySpendingSummary[]) => {
  // Create investments sheet data
  const investmentsData = investmentsByInvestor.flatMap(summary => {
    const baseRow = {
      'Инвестор': summary.investor,
      'Общая сумма': summary.totalInvested
    };
    
    return Object.entries(summary.companies).map(([company, amount]) => ({
      ...baseRow,
      'Компания': company,
      'Сумма инвестиций': amount
    }));
  });
  
  // Create spending sheet data
  const spendingData = spendingByCompany.flatMap(summary => {
    const baseRow = {
      'Компания': summary.company,
      'Общие расходы': summary.totalSpent
    };
    
    return Object.entries(summary.categories).map(([category, amount]) => ({
      ...baseRow,
      'Категория': category,
      'Сумма расходов': amount
    }));
  });
  
  return {
    investmentsData,
    spendingData
  };
};
