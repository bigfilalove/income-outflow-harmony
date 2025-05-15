
const Transaction = require('../../models/Transaction');

// Update transaction status
const updateTransactionStatus = async (req, res, next) => {
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
};

module.exports = {
  updateTransactionStatus
};
