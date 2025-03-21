
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, required: true }, // 'monthly', 'quarterly', 'annual'
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12 for monthly, 1-4 for quarterly, 1 for annual
  type: { type: String, enum: ['expense', 'income'], required: true },
  createdBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  company: { type: String, default: null }
});

// Составной уникальный индекс для предотвращения дублирования бюджетов
budgetSchema.index({ category: 1, period: 1, year: 1, month: 1, type: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
