
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { Session } from '@supabase/supabase-js';
import { checkAuthSupabase, loginWithSupabase, logoutSupabase } from '@/services/api/supabase/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // First set up the auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            
            if (newSession?.user) {
              // Map Supabase user to our app's User type
              const appUser: User = {
                id: newSession.user.id,
                name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
                email: newSession.user.email || '',
                username: newSession.user.user_metadata?.username || newSession.user.email?.split('@')[0] || '',
                password: '', // Don't store passwords
                role: newSession.user.user_metadata?.role || 'user',
                createdAt: new Date(newSession.user.created_at)
              };
              
              setCurrentUser(appUser);
              setIsAuthenticated(true);
            } else {
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }
        );
        
        // Now check for existing session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          const authUser = await checkAuthSupabase();
          if (authUser) {
            setCurrentUser(authUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    // This effect should only run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login with username and password
  const loginWithCredentials = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Поддержка для тестовых учетных данных
      if (username === 'ivanp' && password === 'password123') {
        // Имитация успешного входа для тестового администратора
        const mockUser: User = {
          id: 'admin-id-123',
          name: 'Иван Петров',
          email: 'ivan@example.com',
          username: 'ivanp',
          password: '',
          role: 'admin',
          createdAt: new Date()
        };
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        
        // Сохраняем пользователя в localStorage для имитации сессии
        localStorage.setItem('finance-tracker-user', JSON.stringify(mockUser));
        localStorage.setItem('finance-tracker-token', 'mock-token-admin-123');
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${mockUser.name}!`,
        });
        
        return true;
      }
      
      // Добавляем другие тестовые учетные данные
      if (username === 'marias' && password === 'password456') {
        const mockUser: User = {
          id: 'user-id-456',
          name: 'Мария Сидорова',
          email: 'maria@example.com',
          username: 'marias',
          password: '',
          role: 'user',
          createdAt: new Date()
        };
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-user', JSON.stringify(mockUser));
        localStorage.setItem('finance-tracker-token', 'mock-token-user-456');
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${mockUser.name}!`,
        });
        
        return true;
      }
      
      if (username === 'alexeyi' && password === 'password789') {
        const mockUser: User = {
          id: 'basic-id-789',
          name: 'Алексей Иванов',
          email: 'alexey@example.com',
          username: 'alexeyi',
          password: '',
          role: 'basic',
          createdAt: new Date()
        };
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-user', JSON.stringify(mockUser));
        localStorage.setItem('finance-tracker-token', 'mock-token-basic-789');
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${mockUser.name}!`,
        });
        
        return true;
      }
      
      // Еще один тестовый пользователь
      if (username === 'eremkin' && password === '123456') {
        const mockUser: User = {
          id: 'user-id-101112',
          name: 'Еремкин',
          email: 'eremkin@example.com',
          username: 'eremkin',
          password: '',
          role: 'user',
          createdAt: new Date()
        };
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-user', JSON.stringify(mockUser));
        localStorage.setItem('finance-tracker-token', 'mock-token-user-101112');
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${mockUser.name}!`,
        });
        
        return true;
      }
      
      // Если учетные данные не соответствуют тестовым, пытаемся выполнить вход через Supabase
      const result = await loginWithSupabase(username, password);
      
      if (result) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${result.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Ошибка при входе в систему",
          description: "Неверные учетные данные или пользователь не существует",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка при входе в систему",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Очищаем локальное хранилище для тестовых пользователей
      localStorage.removeItem('finance-tracker-user');
      localStorage.removeItem('finance-tracker-token');
      
      const success = await logoutSupabase();
      
      if (success) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setSession(null);
        
        toast({
          title: "Выход выполнен успешно",
          description: "Вы вышли из системы",
        });
      } else {
        toast({
          title: "Ошибка при выходе из системы",
          description: "Не удалось выйти из системы",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Ошибка при выходе из системы",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentUser,
    session,
    isAuthenticated,
    isLoading,
    loginWithCredentials,
    logout
  };
};
