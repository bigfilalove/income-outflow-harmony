
const Transaction = require('../../models/Transaction');

// Get categories statistics
const getCategoriesStats = async (req, res, next) => {
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
          transfer: [{ $match: { type: 'transfer' } }, { $unwind: '$categories' }, { $replaceRoot: { newRoot: '$categories' } }],
        },
      },
    ]);

    const result = {
      income: stats[0].income || [],
      expense: stats[0].expense || [],
      reimbursement: stats[0].reimbursement || [],
      transfer: stats[0].transfer || [],
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategoriesStats
};
