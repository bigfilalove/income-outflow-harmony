
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], required: true },
  isReimbursement: { type: Boolean, default: false },
  reimbursedTo: { type: String, default: null },
  reimbursementStatus: { type: String, enum: ['pending', 'completed', null], default: null },
  createdBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  company: { type: String, default: null },
  project: { type: String, default: null }
});

module.exports = mongoose.model('Transaction', transactionSchema);
