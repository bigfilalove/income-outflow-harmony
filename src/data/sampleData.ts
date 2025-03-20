
import { Transaction } from '@/types/transaction';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Generate a random date within the last 30 days
const randomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
};

export const sampleTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: 250000,
    description: 'Оплата от клиента ООО "Технологии"',
    category: 'Продажи',
    date: randomDate(),
    type: 'income'
  },
  {
    id: generateId(),
    amount: 180000,
    description: 'Оплата от клиента ИП Иванов',
    category: 'Продажи',
    date: randomDate(),
    type: 'income'
  },
  {
    id: generateId(),
    amount: 50000,
    description: 'Возврат депозита',
    category: 'Возврат средств',
    date: randomDate(),
    type: 'income'
  },
  {
    id: generateId(),
    amount: 120000,
    description: 'Аренда офиса за июль',
    category: 'Аренда',
    date: randomDate(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 350000,
    description: 'Зарплата сотрудникам',
    category: 'Зарплаты',
    date: randomDate(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 45000,
    description: 'Новые компьютеры',
    category: 'Оборудование',
    date: randomDate(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 28000,
    description: 'Реклама в социальных сетях',
    category: 'Маркетинг',
    date: randomDate(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 15000,
    description: 'Электричество и вода',
    category: 'Коммунальные услуги',
    date: randomDate(),
    type: 'expense'
  }
];
