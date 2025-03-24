const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['income', 'expense', 'reimbursement'], required: true }, // Тип категории
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema);