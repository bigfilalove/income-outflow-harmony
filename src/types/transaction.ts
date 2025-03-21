
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
  company?: string; // Добавлено поле компании
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
  company: string | null; // Добавлено поле компании
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

// Список доступных компаний
export const companies = [
  'ООО "Технологии будущего"',
  'ЗАО "Инновации"',
  'ИП Иванов',
  'ООО "Строй-Мастер"',
  'ООО "Финансовые решения"',
  'ООО "Логистик Плюс"',
  'Другая'
];
