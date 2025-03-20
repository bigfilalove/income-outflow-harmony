
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: TransactionType;
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
  ]
};
