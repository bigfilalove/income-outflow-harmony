
const Transaction = require('../../models/Transaction');

// Get all transactions
const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// Create a new transaction
const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!transaction) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
