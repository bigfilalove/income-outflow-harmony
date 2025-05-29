
import mongoose, { Schema, Document } from 'mongoose';

export interface ILocalTransaction extends Document {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  isReimbursement: boolean;
  reimbursedTo?: string;
  reimbursementStatus?: 'pending' | 'completed';
  createdBy?: string;
  createdAt: Date;
  company?: string;
  project?: string;
  isTransfer: boolean;
  fromCompany?: string;
  toCompany?: string;
  hasAllocations: boolean;
  isInvestment: boolean;
  investor?: string;
  investmentExpenseId?: string;
}

const LocalTransactionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  isReimbursement: { type: Boolean, default: false },
  reimbursedTo: { type: String },
  reimbursementStatus: { type: String, enum: ['pending', 'completed'] },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  company: { type: String },
  project: { type: String },
  isTransfer: { type: Boolean, default: false },
  fromCompany: { type: String },
  toCompany: { type: String },
  hasAllocations: { type: Boolean, default: false },
  isInvestment: { type: Boolean, default: false },
  investor: { type: String },
  investmentExpenseId: { type: String }
});

export const LocalTransaction = mongoose.model<ILocalTransaction>('LocalTransaction', LocalTransactionSchema);
