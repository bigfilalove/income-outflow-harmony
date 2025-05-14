
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { Session } from '@supabase/supabase-js';
import { checkAuthSupabase, loginWithSupabase, logoutSupabase } from '@/services/api/supabase/auth';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
  }, []);

  // Login with username and password
  const loginWithCredentials = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await loginWithSupabase(username, password);
      
      if (result) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
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
  }, [navigate]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await logoutSupabase();
      
      if (success) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setSession(null);
        navigate('/login');
        
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
  }, [navigate]);

  return {
    currentUser,
    session,
    isAuthenticated,
    isLoading,
    loginWithCredentials,
    logout
  };
};
