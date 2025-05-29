
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { LocalAuthService } from '@/services/local/LocalAuthService';
import { toast } from '@/hooks/use-toast';

export const useLocalAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('finance-tracker-token');
        
        if (token) {
          const user = await LocalAuthService.verifyToken(token);
          
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('finance-tracker-token');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('finance-tracker-token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loginWithCredentials = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await LocalAuthService.login(username, password);
      
      if (result) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('finance-tracker-token', result.token);
        
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${result.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Ошибка при входе в систему",
          description: "Неверные учетные данные",
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

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      localStorage.removeItem('finance-tracker-token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Выход выполнен успешно",
        description: "Вы вышли из системы",
      });
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
    isAuthenticated,
    isLoading,
    loginWithCredentials,
    logout
  };
};
