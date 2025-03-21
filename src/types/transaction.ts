
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

// Custom event to notify components about company list changes
const dispatchCompaniesUpdated = () => {
  window.dispatchEvent(new Event('companiesUpdated'));
};

// Функция для сохранения списка компаний в локальное хранилище
export const saveCompanies = (updatedCompanies: string[]): void => {
  localStorage.setItem('companies', JSON.stringify(updatedCompanies));
  // Dispatch event to notify components in the same tab
  dispatchCompaniesUpdated();
};
