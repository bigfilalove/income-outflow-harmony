
import { supabase } from '@/lib/supabase';
import { LocalUser } from '@/models/LocalUser';
import { LocalTransaction } from '@/models/LocalTransaction';
import { LocalBudget } from '@/models/LocalBudget';
import { connectMongoDB } from '@/config/mongodb';

export class DataMigrationService {
  static async migrateFromSupabase(): Promise<{
    usersCount: number;
    transactionsCount: number;
    budgetsCount: number;
    errors: string[];
  }> {
    const results = {
      usersCount: 0,
      transactionsCount: 0,
      budgetsCount: 0,
      errors: [] as string[]
    };

    try {
      // Ensure MongoDB connection
      await connectMongoDB();

      // Migrate transactions
      try {
        const { data: transactions, error: transError } = await supabase
          .from('transactions')
          .select('*');

        if (transError) {
          results.errors.push(`Transaction migration error: ${transError.message}`);
        } else if (transactions) {
          for (const transaction of transactions) {
            try {
              const localTransaction = new LocalTransaction({
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category,
                date: new Date(transaction.date),
                type: transaction.type,
                isReimbursement: transaction.is_reimbursement || false,
                reimbursedTo: transaction.reimbursed_to,
                reimbursementStatus: transaction.reimbursement_status,
                createdBy: transaction.created_by,
                createdAt: new Date(transaction.created_at),
                company: transaction.company,
                project: transaction.project,
                isTransfer: transaction.is_transfer || false,
                fromCompany: transaction.from_company,
                toCompany: transaction.to_company,
                hasAllocations: transaction.has_allocations || false,
                isInvestment: transaction.is_investment || false,
                investor: transaction.investor,
                investmentExpenseId: transaction.investment_expense_id
              });

              await localTransaction.save();
              results.transactionsCount++;
            } catch (error) {
              results.errors.push(`Failed to migrate transaction ${transaction.id}: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Transaction migration failed: ${error}`);
      }

      // Migrate budgets
      try {
        const { data: budgets, error: budgetError } = await supabase
          .from('budgets')
          .select('*');

        if (budgetError) {
          results.errors.push(`Budget migration error: ${budgetError.message}`);
        } else if (budgets) {
          for (const budget of budgets) {
            try {
              const localBudget = new LocalBudget({
                category: budget.category,
                amount: budget.amount,
                period: budget.period,
                year: budget.year,
                month: budget.month,
                type: budget.type,
                createdBy: budget.created_by,
                createdAt: new Date(budget.created_at),
                company: budget.company
              });

              await localBudget.save();
              results.budgetsCount++;
            } catch (error) {
              results.errors.push(`Failed to migrate budget ${budget.id}: ${error}`);
            }
          }
        }
      } catch (error) {
        results.errors.push(`Budget migration failed: ${error}`);
      }

      // Create default admin user
      try {
        await LocalUser.findOneAndDelete({ username: 'admin' }); // Remove if exists
        const adminUser = new LocalUser({
          name: 'Администратор',
          email: 'admin@localhost',
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        });
        await adminUser.save();
        results.usersCount++;
      } catch (error) {
        results.errors.push(`Failed to create admin user: ${error}`);
      }

    } catch (error) {
      results.errors.push(`Migration failed: ${error}`);
    }

    return results;
  }
}
