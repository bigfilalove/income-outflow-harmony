
const mongoose = require('mongoose');

const projectAllocationSchema = new mongoose.Schema({
  project: { type: String, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  isReimbursement: { type: Boolean, default: false },
  reimbursedTo: { type: String, default: null },
  reimbursementStatus: { type: String, enum: ['pending', 'completed', null], default: null },
  createdBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  company: { type: String, default: null },
  project: { type: String, default: null },
  // New fields for transfer transactions
  toCompany: { type: String, default: null },
  fromCompany: { type: String, default: null },
  isTransfer: { type: Boolean, default: false },
  // New field for project allocations
  projectAllocations: [projectAllocationSchema],
  hasAllocations: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
