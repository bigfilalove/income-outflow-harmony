
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
