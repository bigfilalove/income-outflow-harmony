import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { checkSupabaseConnection } from '@/lib/supabase';
import { ConnectionStatus } from '@/components/login/ConnectionStatus';
import LoginForm from '@/components/login/LoginForm';
import TestAccounts from '@/components/login/TestAccounts';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkSupabaseConnectionDetailed } from '@/utils/supabaseConnectionCheck';
import { useAuth } from '@/context/AuthContext';
import { SupabaseConnectionDebug } from '@/components/debug/SupabaseConnectionDebug';

const Login = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>("checking");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  // Перенаправляем аутентифицированных пользователей
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      console.log('Login page: Пользователь уже авторизован, перенаправление:', currentUser);
      
      // Перенаправление на основе роли пользователя
      if (currentUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (currentUser.role === 'user') {
        navigate('/transactions', { replace: true });
      } else if (currentUser.role === 'basic') {
        navigate('/basic-transactions', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, isLoading, navigate]);

  useEffect(() => {
    const verifyConnection = async () => {
      setConnectionStatus('checking');
      
      try {
        // Add a small delay before checking connection to ensure UI shows the checking state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const connectionResult = await checkSupabaseConnectionDetailed();
        
        if (connectionResult.isConnected) {
          setConnectionStatus('connected');
          setConnectionError(null);
          console.log("Successfully connected to Supabase");
          
          toast({
            title: "Соединение установлено",
            description: "Успешное подключение к Supabase"
          });
        } else {
          setConnectionStatus('error');
          setConnectionError(connectionResult.details.errorMessage || 'Не удалось подключиться к Supabase. Вы можете использовать тестовые аккаунты для входа.');
          console.log("Connection error with Supabase, but allowing login with demo accounts");
          
          toast({
            title: "Ошибка соединения",
            description: "Не удалось подключиться к Supabase. Используйте тестовые аккаунты.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionStatus('error');
        setConnectionError('Ошибка при проверке соединения с Supabase. Вы можете использовать тестовые аккаунты для входа.');
        console.log("Connection error with Supabase, but allowing login with demo accounts");
        
        toast({
          title: "Ошибка соединения",
          description: "Ошибка при проверке соединения с Supabase. Используйте тестовые аккаунты.",
          variant: "destructive"
        });
      }
    };
    
    verifyConnection();
  }, []);

  // Если пользователь уже аутентифицирован, показываем пустую страницу до перенаправления
  if (!isLoading && isAuthenticated && currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-md space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="connection">Диагностика</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Вход в систему</CardTitle>
              <CardDescription className="text-center">
                Введите ваш логин и пароль для входа
              </CardDescription>
            </CardHeader>

            <div className="px-6 pb-2">
              <ConnectionStatus 
                status={connectionStatus} 
                errorMessage={connectionError} 
              />
            </div>

            <LoginForm />
          </Card>

          <TestAccounts />
        </TabsContent>
        
        <TabsContent value="connection">
          <SupabaseConnectionDebug />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
