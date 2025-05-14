
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User as AppUser } from '@/types/user';
import { demoUsers } from '@/services/api/supabase/auth';
import { toast } from '@/hooks/use-toast';

/**
 * Расширенный хук для управления состоянием аутентификации
 * Поддерживает как Supabase Auth, так и демо-аккаунты
 */
export const useAuthProvider = () => {
  // Состояние аутентификации Supabase
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  
  // Состояние пользователя приложения
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Список демо-пользователей
  const [demoUsersList, setDemoUsersList] = useState<AppUser[]>(() => {
    const savedUsers = localStorage.getItem('finance-tracker-users');
    return savedUsers ? JSON.parse(savedUsers) : demoUsers;
  });
  
  // Пароль администратора для демо-режима
  const [adminPassword, setAdminPassword] = useState(() => {
    const savedPassword = localStorage.getItem('finance-tracker-admin-password');
    return savedPassword || '123456';
  });

  // Сохраняем демо-пользователей в localStorage
  useEffect(() => {
    localStorage.setItem('finance-tracker-users', JSON.stringify(demoUsersList));
  }, [demoUsersList]);

  // Сохраняем пароль администратора в localStorage
  useEffect(() => {
    localStorage.setItem('finance-tracker-admin-password', adminPassword);
  }, [adminPassword]);

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
          // Проверяем, есть ли демо-пользователь
          const storedUserStr = localStorage.getItem('finance-tracker-user');
          const storedToken = localStorage.getItem('finance-tracker-token');
          
          if (storedUserStr && storedToken && storedToken.startsWith('demo-token-')) {
            try {
              const demoUser = JSON.parse(storedUserStr);
              setCurrentUser(demoUser);
              setIsAuthenticated(true);
              console.log('Восстановлен демо-пользователь из localStorage:', demoUser.username);
            } catch (error) {
              console.error('Ошибка при разборе демо-пользователя:', error);
              setCurrentUser(null);
              setIsAuthenticated(false);
              // Очищаем некорректные данные
              localStorage.removeItem('finance-tracker-user');
              localStorage.removeItem('finance-tracker-token');
            }
          } else {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
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
        // Слушатель выше уже проверит демо-пользователя
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
      
      // Сначала проверяем демо-аккаунты
      const demoUser = demoUsersList.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (demoUser) {
        console.log('Вход в демо-аккаунт успешен:', demoUser.username);
        
        // Устанавливаем демо-пользователя
        setCurrentUser(demoUser);
        setIsAuthenticated(true);
        
        // Сохраняем в localStorage для постоянства
        localStorage.setItem('finance-tracker-user', JSON.stringify(demoUser));
        localStorage.setItem('finance-tracker-token', 'demo-token-' + Date.now());
        
        setIsLoading(false);
        return true;
      }
      
      // Затем пробуем Supabase аутентификацию
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
    
    // Проверяем, это демо-пользователь или Supabase
    const token = localStorage.getItem('finance-tracker-token');
    if (token && token.startsWith('demo-token-')) {
      // Демо-пользователь
      localStorage.removeItem('finance-tracker-user');
      localStorage.removeItem('finance-tracker-token');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } else {
      // Supabase пользователь
      await supabase.auth.signOut();
      // Сессия и пользователь будут обновлены через onAuthStateChange
    }
    
    console.log('Выход выполнен успешно');
    setIsLoading(false);
  };

  // Регистрация нового пользователя (только для демо-режима)
  const addDemoUser = async (userData: Omit<AppUser, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      console.log("Создание нового пользователя:", userData);
      
      // Создаем нового пользователя
      const newUser: AppUser = {
        ...userData,
        id: String(Date.now()),
        createdAt: new Date()
      };
      
      setDemoUsersList(prev => [...prev, newUser]);
      return true;
    } catch (error) {
      console.error("Не удалось создать пользователя:", error);
      toast({
        title: "Не удалось создать пользователя",
        variant: "destructive"
      });
      return false;
    }
  };

  // Удаление демо-пользователя
  const removeDemoUser = (userId: string) => {
    setDemoUsersList(prev => prev.filter(user => user.id !== userId));
    
    // Если удаляем текущего пользователя, разлогиниваемся
    if (currentUser?.id === userId) {
      logout();
      return true;
    }
    
    return false;
  };

  // Управление паролем администратора для демо-режима
  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const verifyAdminPassword = (password: string): boolean => {
    return password === adminPassword;
  };

  return {
    // Состояние
    currentUser,
    session,
    supabaseUser,
    isAuthenticated,
    isLoading,
    demoUsersList,
    adminPassword,
    
    // Методы
    loginWithCredentials,
    logout,
    addDemoUser,
    removeDemoUser,
    updateAdminPassword,
    verifyAdminPassword
  };
};
