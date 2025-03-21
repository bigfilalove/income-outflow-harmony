
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
}

export interface ServerTransaction {
  id: string;
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
}

export const transactionCategories = {
  income: [
    'Продажи',
    'Инвестиции',
    'Возврат средств',
    'Кредиты',
    'Другое'
  ],
  expense: [
    'Аренда',
    'Зарплаты',
    'Оборудование',
    'Маркетинг',
    'Коммунальные услуги',
    'Налоги',
    'Другое'
  ],
  reimbursement: [
    'Транспорт',
    'Командировки',
    'Оборудование',
    'Канцелярия',
    'Клиентские встречи',
    'Другое'
  ]
};

export interface CategoryList {
  income: string[];
  expense: string[];
  reimbursement: string[];
}

// Список доступных компаний (значение по умолчанию)
export const companies = [
  'ООО "Технологии будущего"',
  'ЗАО "Инновации"',
  'ИП Иванов',
  'ООО "Строй-Мастер"',
  'ООО "Финансовые решения"',
  'ООО "Логистик Плюс"',
  'Другая'
];

// Custom event to notify components about company list changes
const dispatchCompaniesUpdated = () => {
  window.dispatchEvent(new Event('companiesUpdated'));
};

// Custom event to notify components about category list changes
const dispatchCategoriesUpdated = () => {
  window.dispatchEvent(new Event('categoriesUpdated'));
};

// Функция для получения актуального списка компаний из локального хранилища
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

// Функция для сохранения списка компаний в локальное хранилище
export const saveCompanies = (updatedCompanies: string[]): void => {
  localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  // Dispatch event to notify components in the same tab
  dispatchCompaniesUpdated();
};

// Get categories from local storage or use default
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

// Save categories to local storage
export const saveCategories = (updatedCategories: CategoryList): void => {
  localStorage.setItem('transactionCategories', JSON.stringify(updatedCategories));
  dispatchCategoriesUpdated();
};
