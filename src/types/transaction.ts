export type TransactionType = 'income' | 'expense' | 'reimbursement';
export type ReimbursementStatus = 'pending' | 'completed';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: TransactionType;
  isReimbursement?: boolean;
  reimbursedTo?: string;
  reimbursementStatus?: ReimbursementStatus;
  createdBy?: string;
  createdAt?: Date;
  company?: string;
  project?: string;
}

export interface ServerTransaction {
  _id?: string; // MongoDB id
  id?: string; // For backwards compatibility
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  isReimbursement: boolean;
  reimbursedTo: string | null;
  reimbursementStatus: ReimbursementStatus | null;
  createdBy: string | null;
  createdAt: string;
  company: string | null;
  project: string | null;
}


export interface CategoryList {
  income: string[];
  expense: string[];
  reimbursement: string[];
}


const dispatchCompaniesUpdated = () => {
  window.dispatchEvent(new Event('companiesUpdated'));
};

const dispatchCategoriesUpdated = () => {
  window.dispatchEvent(new Event('categoriesUpdated'));
};

const dispatchProjectsUpdated = () => {
  window.dispatchEvent(new Event('projectsUpdated'));
};

export const getCompanies = (): string[] => {
  const storedCompanies = localStorage.getItem('companies');
  if (storedCompanies) {
    try {
      return JSON.parse(storedCompanies);
    } catch (error) {
      console.error('Error parsing companies:', error);
    }
  }
  return companies;
};

export const saveCompanies = (updatedCompanies: string[]): void => {
  localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  dispatchCompaniesUpdated();
};

export const getTransactionCategories = (): CategoryList => {
  const storedCategories = localStorage.getItem('transactionCategories');
  if (storedCategories) {
    try {
      return JSON.parse(storedCategories);
    } catch (error) {
      console.error('Error parsing categories:', error);
    }
  }
  return transactionCategories;
};

export const saveCategories = (updatedCategories: CategoryList): void => {
  localStorage.setItem('transactionCategories', JSON.stringify(updatedCategories));
  dispatchCategoriesUpdated();
};

export const getProjects = (): string[] => {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    try {
      return JSON.parse(storedProjects);
    } catch (error) {
      console.error('Error parsing projects:', error);
    }
  }
  return projects;
};

export const saveProjects = (updatedProjects: string[]): void => {
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  dispatchProjectsUpdated();
};
