
const Transaction = require('../../models/Transaction');

// Get company cash flow
const getCompanyCashFlow = async (req, res, next) => {
  try {
    const { startDate, endDate, company } = req.query;
    
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (company) {
      query.$or = [
        { company },
        { fromCompany: company },
        { toCompany: company }
      ];
    }
    
    const transactions = await Transaction.find(query);
    
    // Calculate cash flow by company
    const companyFlowMap = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income' || transaction.type === 'expense') {
        if (!transaction.company) return;
        
        if (!companyFlowMap[transaction.company]) {
          companyFlowMap[transaction.company] = {
            company: transaction.company,
            inflow: 0,
            outflow: 0,
            transfers: { incoming: 0, outgoing: 0 },
            balance: 0
          };
        }
        
        if (transaction.type === 'income') {
          companyFlowMap[transaction.company].inflow += transaction.amount;
          companyFlowMap[transaction.company].balance += transaction.amount;
        } else {
          companyFlowMap[transaction.company].outflow += transaction.amount;
          companyFlowMap[transaction.company].balance -= transaction.amount;
        }
      } 
      else if (transaction.type === 'transfer' && transaction.isTransfer) {
        const fromCompany = transaction.fromCompany;
        const toCompany = transaction.toCompany;
        
        if (fromCompany) {
          if (!companyFlowMap[fromCompany]) {
            companyFlowMap[fromCompany] = {
              company: fromCompany,
              inflow: 0,
              outflow: 0,
              transfers: { incoming: 0, outgoing: 0 },
              balance: 0
            };
          }
          
          companyFlowMap[fromCompany].transfers.outgoing += transaction.amount;
          companyFlowMap[fromCompany].balance -= transaction.amount;
        }
        
        if (toCompany) {
          if (!companyFlowMap[toCompany]) {
            companyFlowMap[toCompany] = {
              company: toCompany,
              inflow: 0,
              outflow: 0,
              transfers: { incoming: 0, outgoing: 0 },
              balance: 0
            };
          }
          
          companyFlowMap[toCompany].transfers.incoming += transaction.amount;
          companyFlowMap[toCompany].balance += transaction.amount;
        }
      }
    });
    
    res.json(Object.values(companyFlowMap));
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanyCashFlow
};
