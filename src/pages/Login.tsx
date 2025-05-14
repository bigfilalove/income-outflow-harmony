
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { checkSupabaseConnection } from '@/lib/supabase';
import { ConnectionStatus } from '@/components/login/ConnectionStatus';
import { LoginForm } from '@/components/login/LoginForm';
import { TestAccounts } from '@/components/login/TestAccounts';

const Login = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>("checking");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const verifyConnection = async () => {
      setConnectionStatus('checking');
      
      try {
        // Add a small delay before checking connection to ensure UI shows the checking state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const isConnected = await checkSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('connected');
          setConnectionError(null);
          console.log("Successfully connected to Supabase");
        } else {
          setConnectionStatus('error');
          setConnectionError('Не удалось подключиться к Supabase. Вы можете использовать тестовые аккаунты для входа.');
          console.log("Connection error with Supabase, but allowing login with demo accounts");
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionStatus('error');
        setConnectionError('Ошибка при проверке соединения с Supabase. Вы можете использовать тестовые аккаунты для входа.');
        console.log("Connection error with Supabase, but allowing login with demo accounts");
      }
    };
    
    verifyConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
    </div>
  );
};

export default Login;
