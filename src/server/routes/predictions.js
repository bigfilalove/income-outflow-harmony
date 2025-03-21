
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all prediction routes
router.use(authenticate);

// Get predictions
router.get('/', async (req, res, next) => {
  try {
    // Get all transactions for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const transactions = await Transaction.find({
      date: { $gte: sixMonthsAgo }
    }).sort({ date: -1 });
    
    if (transactions.length === 0) {
      return res.json({
        currentBalance: 0,
        predictedIncome: 0,
        predictedExpense: 0,
        predictedBalance: 0,
        topExpenseCategories: []
      });
    }
    
    // Calculate current balance
    const allTransactions = await Transaction.find();
    const income = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = income - expense;
    
    // Perform predictions
    // Group transactions by month
    const transactionsByMonth = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
      
      if (!transactionsByMonth[monthYear]) {
        transactionsByMonth[monthYear] = [];
      }
      
      transactionsByMonth[monthYear].push(transaction);
    });
    
    // Calculate income and expense per month
    const monthlyData = Object.keys(transactionsByMonth).map(monthYear => {
      const monthTransactions = transactionsByMonth[monthYear];
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { monthYear, income, expense };
    });
    
    // Simple linear prediction for next month
    const nextMonthIncome = monthlyData.length > 0 
      ? Math.round(monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length)
      : 0;
      
    const nextMonthExpense = monthlyData.length > 0
      ? Math.round(monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length)
      : 0;
      
    // Calculate predicted balance
    const predictedBalance = currentBalance + nextMonthIncome - nextMonthExpense;
    
    // Get top expense categories
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    const topExpenseCategories = Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category,
        amount: Math.round(Number(total) / 6) // Average monthly expense per category
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    res.json({
      currentBalance,
      predictedIncome: nextMonthIncome,
      predictedExpense: nextMonthExpense,
      predictedBalance,
      topExpenseCategories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
