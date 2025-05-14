
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User as AppUser } from '@/types/user';
import { toast } from '@/hooks/use-toast';

/**
 * Расширенный хук для управления состоянием аутентификации
 * Поддерживает Supabase Auth
 */
export const useAuthProvider = () => {
  // Состояние аутентификации Supabase
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  
  // Состояние пользователя приложения
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация проверки авторизации и настройка слушателя изменений
  useEffect(() => {
    setIsLoading(true);
    
    // Устанавливаем слушатель изменений состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Событие аутентификации:', event, !!session);
        
        // Синхронно обновляем состояние сессии и пользователя
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        // Асинхронно обрабатываем изменение состояния
        if (session) {
          // Избегаем использования setTimeout, чтобы предотвратить задержки
          const userRole = session.user?.user_metadata?.role as 'admin' | 'user' | 'basic';
          const appUser: AppUser = {
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Пользователь',
            email: session.user.email || '',
            username: session.user.email?.split('@')[0] || '',
            password: '', // Не храним пароль
            role: userRole || 'basic',
            createdAt: new Date(session.user.created_at)
          };
          
          setCurrentUser(appUser);
          setIsAuthenticated(true);
          
          // Сохраняем пользователя в localStorage для резервного сохранения
          localStorage.setItem('finance-tracker-user', JSON.stringify(appUser));
          localStorage.setItem('finance-tracker-token', session.access_token);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('finance-tracker-user');
          localStorage.removeItem('finance-tracker-token');
        }
        
        setIsLoading(false);
      }
    );

    // Проверяем существующую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Ошибка получения сессии:', error);
      }
      
      // Слушатель onAuthStateChange уже обработает обновление состояния
      // Это нужно только для начальной загрузки
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Методы аутентификации
  
  // Логин с помощью учетных данных
  const loginWithCredentials = async (
    username: string, 
    password: string
  ): Promise<boolean> => {
    try {
      console.log('Попытка входа с учетными данными:', username);
      setIsLoading(true);
      
      // Пробуем Supabase аутентификацию
      const isEmail = username.includes('@');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isEmail ? username : `${username}@example.com`,
        password: password
      });
      
      if (error) {
        console.error('Ошибка входа через Supabase:', error.message);
        toast({
          title: "Не удалось войти в систему",
          description: "Проверьте логин и пароль",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      // Сессия и пользователь будут обновлены через onAuthStateChange
      console.log('Вход через Supabase успешен');
      
      // Небольшая задержка перед установкой флага, чтобы onAuthStateChange успел сработать
      // но уже возвращаем true, чтобы UI знал, что логин успешен
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return true;
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast({
        title: "Ошибка при входе в систему",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Выход из системы
  const logout = async () => {
    setIsLoading(true);
    
    // Supabase пользователь
    await supabase.auth.signOut();
    // Сессия и пользователь будут обновлены через onAuthStateChange
    
    console.log('Выход выполнен успешно');
    setIsLoading(false);
  };

  return {
    // Состояние
    currentUser,
    session,
    supabaseUser,
    isAuthenticated,
    isLoading,
    
    // Методы
    loginWithCredentials,
    logout
  };
};
