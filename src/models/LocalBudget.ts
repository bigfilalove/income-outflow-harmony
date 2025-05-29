
import mongoose, { Schema, Document } from 'mongoose';

export interface ILocalBudget extends Document {
  _id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'annual';
  year: number;
  month: number;
  type: 'expense' | 'income';
  createdBy?: string;
  createdAt: Date;
  company?: string;
}

const LocalBudgetSchema: Schema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  company: { type: String }
});

// Unique index to prevent duplicate budgets
LocalBudgetSchema.index({ category: 1, period: 1, year: 1, month: 1, type: 1, company: 1 }, { unique: true });

export const LocalBudget = mongoose.model<ILocalBudget>('LocalBudget', LocalBudgetSchema);
