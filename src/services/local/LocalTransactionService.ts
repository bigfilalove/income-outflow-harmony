
import { LocalTransaction, ILocalTransaction } from '../../models/LocalTransaction';
import { Transaction } from '../../types/transaction';

export class LocalTransactionService {
  static async fetchTransactions(): Promise<Transaction[]> {
    try {
      const localTransactions = await LocalTransaction.find().sort({ date: -1 });
      
      return localTransactions.map(this.mapToTransaction);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  static async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const localTransaction = new LocalTransaction({
        ...transaction,
        date: new Date(transaction.date)
      });
      
      const saved = await localTransaction.save();
      return this.mapToTransaction(saved);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  static async updateTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const updated = await LocalTransaction.findByIdAndUpdate(
        transaction.id,
        { ...transaction, date: new Date(transaction.date) },
        { new: true }
      );

      if (!updated) {
        throw new Error('Transaction not found');
      }

      return this.mapToTransaction(updated);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const deleted = await LocalTransaction.findByIdAndDelete(id);
      
      if (!deleted) {
        throw new Error('Transaction not found');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  private static mapToTransaction(localTransaction: ILocalTransaction): Transaction {
    return {
      id: localTransaction._id.toString(),
      amount: localTransaction.amount,
      description: localTransaction.description,
      category: localTransaction.category,
      date: localTransaction.date,
      type: localTransaction.type,
      isReimbursement: localTransaction.isReimbursement,
      reimbursedTo: localTransaction.reimbursedTo,
      reimbursementStatus: localTransaction.reimbursementStatus,
      createdBy: localTransaction.createdBy,
      createdAt: localTransaction.createdAt,
      company: localTransaction.company,
      project: localTransaction.project,
      isTransfer: localTransaction.isTransfer,
      fromCompany: localTransaction.fromCompany,
      toCompany: localTransaction.toCompany,
      hasAllocations: localTransaction.hasAllocations,
      isInvestment: localTransaction.isInvestment,
      investor: localTransaction.investor,
      investmentExpenseId: localTransaction.investmentExpenseId
    };
  }
}
