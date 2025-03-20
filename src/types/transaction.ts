
export type TransactionType = 'income' | 'expense' | 'reimbursement';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: TransactionType;
  isReimbursement?: boolean;
  reimbursedTo?: string;
  reimbursementStatus?: 'pending' | 'completed';
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
