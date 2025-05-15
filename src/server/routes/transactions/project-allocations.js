
const Transaction = require('../../models/Transaction');

// Get all transactions with project allocations
const getProjectAllocations = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ 
      hasAllocations: true 
    }).sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get summary of allocations by project
const getProjectAllocationsSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build query
    const query = { hasAllocations: true };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query);
    
    // Process transactions to get summary
    const projectSummary = {};
    
    transactions.forEach(transaction => {
      if (!transaction.projectAllocations || !transaction.projectAllocations.length) return;
      
      const isExpense = transaction.type === 'expense';
      const isInvestment = transaction.isInvestment === true;
      
      transaction.projectAllocations.forEach(allocation => {
        const { project, amount } = allocation;
        
        if (!projectSummary[project]) {
          projectSummary[project] = {
            income: 0,
            expense: 0,
            investment: 0,
            totalAmount: 0
          };
        }
        
        if (isInvestment) {
          projectSummary[project].investment += amount;
        } else if (isExpense) {
          projectSummary[project].expense += amount;
        } else {
          projectSummary[project].income += amount;
        }
        
        // Calculate total (income + investment - expense)
        projectSummary[project].totalAmount = 
          projectSummary[project].income + 
          projectSummary[project].investment - 
          projectSummary[project].expense;
      });
    });
    
    // Convert to array format
    const result = Object.keys(projectSummary).map(project => ({
      project,
      ...projectSummary[project]
    }));
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectAllocations,
  getProjectAllocationsSummary
};
