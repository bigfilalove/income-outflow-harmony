import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TestAccount = {
  username: string;
  password: string;
  role: string;
};

const testAccounts: TestAccount[] = [
  { username: 'admin', password: 'password123', role: 'Администратор' },
  { username: 'user', password: 'password123', role: 'Пользователь' },
  { username: 'basic', password: 'password123', role: 'Базовый пользователь' },
  { username: 'accountant', password: 'password123', role: 'Бухгалтер' },
  { username: 'manager', password: 'password123', role: 'Менеджер' }
];

export const TestAccounts = () => {
  return (
    <Card className="w-full max-w-md mt-4">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Тестовые аккаунты для демо</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs space-y-1">
          {testAccounts.map((account, index) => (
            <div key={index} className="flex justify-between">
              <span>{account.role}: <strong>{account.username}</strong></span>
              <span>Пароль: <strong>{account.password}</strong></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAccounts; // Keep default export for backward compatibility
