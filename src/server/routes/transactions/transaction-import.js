
const Transaction = require('../../models/Transaction');

// Bulk import transactions
const importTransactions = async (req, res, next) => {
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
};

module.exports = {
  importTransactions
};
