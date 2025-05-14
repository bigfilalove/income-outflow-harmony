
import { User } from '@/types/user';

// Sample users data with usernames and passwords
export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@example.com',
    username: 'admin',
    password: 'password123',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Пользователь',
    email: 'user@example.com',
    username: 'user',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: 'Базовый пользователь',
    email: 'basic@example.com',
    username: 'basic',
    password: 'password123',
    role: 'basic',
    createdAt: new Date('2023-01-03')
  },
  {
    id: '4',
    name: 'Бухгалтер',
    email: 'accountant@example.com',
    username: 'accountant',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-04')
  },
  {
    id: '5',
    name: 'Менеджер',
    email: 'manager@example.com',
    username: 'manager',
    password: 'password123',
    role: 'user',
    createdAt: new Date('2023-01-05')
  }
];
