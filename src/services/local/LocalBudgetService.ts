
import { LocalBudget, ILocalBudget } from '../../models/LocalBudget';
import { Budget, BudgetPeriod } from '../../types/budget';

export class LocalBudgetService {
  static async fetchBudgets(
    period?: BudgetPeriod,
    year?: number,
    month?: number,
    type?: 'income' | 'expense',
    company?: string
  ): Promise<Budget[]> {
    try {
      const query: any = {};
      
      if (period) query.period = period;
      if (year) query.year = year;
      if (month) query.month = month;
      if (type) query.type = type;
      if (company) query.company = company;

      const localBudgets = await LocalBudget.find(query).sort({ year: -1, month: 1 });
      
      return localBudgets.map(this.mapToBudget);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  static async createBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget> {
    try {
      // Check if budget already exists
      const existing = await LocalBudget.findOne({
        category: budget.category,
        period: budget.period,
        year: budget.year,
        month: budget.month,
        type: budget.type,
        company: budget.company || undefined
      });

      if (existing) {
        // Update existing budget
        existing.amount = budget.amount;
        const updated = await existing.save();
        return this.mapToBudget(updated);
      }

      // Create new budget
      const localBudget = new LocalBudget(budget);
      const saved = await localBudget.save();
      return this.mapToBudget(saved);
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  static async updateBudget(budget: Budget): Promise<Budget> {
    try {
      const updated = await LocalBudget.findByIdAndUpdate(
        budget.id,
        budget,
        { new: true }
      );

      if (!updated) {
        throw new Error('Budget not found');
      }

      return this.mapToBudget(updated);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  static async deleteBudget(id: string): Promise<void> {
    try {
      const deleted = await LocalBudget.findByIdAndDelete(id);
      
      if (!deleted) {
        throw new Error('Budget not found');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  private static mapToBudget(localBudget: ILocalBudget): Budget {
    return {
      id: localBudget._id.toString(),
      category: localBudget.category,
      amount: localBudget.amount,
      period: localBudget.period as BudgetPeriod,
      year: localBudget.year,
      month: localBudget.month,
      type: localBudget.type,
      createdBy: localBudget.createdBy,
      createdAt: localBudget.createdAt,
      company: localBudget.company
    };
  }
}
