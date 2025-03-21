
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password using the comparePassword method
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        role: user.role,
        name: user.name
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { name, email, username, password, role = 'basic' } = req.body;
  
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      name,
      email,
      username,
      password,
      role
    });
    
    // Create token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        username: newUser.username,
        role: newUser.role,
        name: newUser.name
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Transaction Routes (Protected)
app.get('/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/transactions', authenticate, async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/transactions/:id', authenticate, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/transactions/:id/status', authenticate, async (req, res) => {
  const { reimbursementStatus } = req.body;
  
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    transaction.reimbursementStatus = reimbursementStatus;
    await transaction.save();
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Prediction Routes (Protected)
app.get('/predictions', authenticate, async (req, res) => {
  try {
    // Get all transactions for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const transactions = await Transaction.find({
      date: { $gte: sixMonthsAgo }
    }).sort({ date: -1 });
    
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
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Routes (For admin purposes)
app.get('/users', authenticate, async (req, res) => {
  // Only admin can access users list
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
  console.log(`Auth endpoints: http://localhost:${PORT}/auth/login and http://localhost:${PORT}/auth/register`);
  console.log(`Protected endpoints: http://localhost:${PORT}/transactions (requires authentication)`);
});

