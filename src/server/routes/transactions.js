
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all transaction routes
router.use(authenticate);

// Get all transactions
router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Create a new transaction
router.post('/', async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// Delete a transaction
router.delete('/:id', async (req, res, next) => {
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
});

// Update transaction status
router.patch('/:id/status', async (req, res, next) => {
  const { reimbursementStatus } = req.body;
  
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      throw error;
    }
    
    transaction.reimbursementStatus = reimbursementStatus;
    await transaction.save();
    
    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
