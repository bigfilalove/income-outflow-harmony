
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

// Sample users for demo authentication
export const demoUsers: User[] = [
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

// Проверка текущей сессии/аутентификации
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    console.log('[Supabase Auth] Проверка состояния аутентификации...');
    
    // Получаем сессию из Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('[Supabase Auth] Активная сессия Supabase найдена:', session.user.id);
      const { user: supabaseUser } = session;
      
      // Возвращаем данные пользователя
      const userRole = (supabaseUser.user_metadata.role as 'admin' | 'user' | 'basic') || 'basic';
      
      const user: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        username: supabaseUser.email?.split('@')[0] || '',
        password: '', // Мы не храним и не возвращаем пароль
        role: userRole,
        createdAt: new Date(supabaseUser.created_at)
      };
      
      return user;
    }
    
    // Если нет сессии Supabase, проверяем localStorage на наличие демо-пользователя
    const storedUser = localStorage.getItem('finance-tracker-user');
    const storedToken = localStorage.getItem('finance-tracker-token');
    
    if (storedUser && storedToken) {
      console.log('[Supabase Auth] Сессии Supabase нет, но найден сохраненный пользователь');
      return JSON.parse(storedUser);
    }
    
    console.log('[Supabase Auth] Аутентификация не найдена');
    return null;
  } catch (error) {
    console.error('[Supabase Auth] Ошибка при проверке состояния аутентификации:', error);
    return null;
  }
};
