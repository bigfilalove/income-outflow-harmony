
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

// Bulk import transactions
router.post('/import', async (req, res, next) => {
  try {
    const transactions = req.body.transactions;
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions provided for import' });
    }
    
    const results = {
      total: transactions.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (const transaction of transactions) {
      try {
        await Transaction.create(transaction);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          transaction: transaction.description || 'Unknown',
          error: error.message
        });
      }
    }
    
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
});

// routes/transactions.js
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

// Bulk import transactions
router.post('/import', async (req, res, next) => {
  try {
    const transactions = req.body.transactions;
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions provided for import' });
    }
    
    const results = {
      total: transactions.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (const transaction of transactions) {
      try {
        await Transaction.create(transaction);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          transaction: transaction.description || 'Unknown',
          error: error.message
        });
      }
    }
    
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
});

// Update a transaction
router.put('/:id', async (req, res, next) => {
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

// Get categories statistics
router.get('/categories-stats', async (req, res, next) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          categories: {
            $push: {
              category: '$_id.category',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          categories: {
            $sortArray: {
              input: '$categories',
              sortBy: { count: -1 },
            },
          },
        },
      },
      {
        $facet: {
          income: [{ $match: { type: 'income' } }, { $unwind: '$categories' }, { $replaceRoot: { newRoot: '$categories' } }],
          expense: [{ $match: { type: 'expense' } }, { $unwind: '$categories' }, { $replaceRoot: { newRoot: '$categories' } }],
          reimbursement: [{ $match: { type: 'reimbursement' } }, { $unwind: '$categories' }, { $replaceRoot: { newRoot: '$categories' } }],
        },
      },
    ]);

    const result = {
      income: stats[0].income || [],
      expense: stats[0].expense || [],
      reimbursement: stats[0].reimbursement || [],
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
// Update a transaction
router.put('/:id', async (req, res, next) => {
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
