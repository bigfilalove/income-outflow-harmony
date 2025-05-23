
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { checkSupabaseConnection } from '@/lib/utils';
import { ConnectionStatus } from './ConnectionStatus';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { loginWithCredentials, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        if (isConnected) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
          setConnectionError('Could not connect to Supabase. Please check your configuration.');
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setConnectionStatus('error');
        setConnectionError('Error checking Supabase connection');
      }
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      console.log('Attempting login with:', username, 'password: [HIDDEN]');
      const success = await loginWithCredentials(username, password);
      
      if (success) {
        toast({
          title: "Вход выполнен успешно",
          description: "Добро пожаловать в систему"
        });
        navigate('/');
      } else {
        setError('Неверные учетные данные. Пожалуйста, проверьте логин и пароль.');
        toast({
          title: "Ошибка при входе в систему",
          description: "Неверные учетные данные",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Не удалось войти в систему. Пожалуйста, попробуйте позже.');
      toast({
        title: "Ошибка при входе в систему",
        description: err.message || "Произошла ошибка при входе",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0">
      {/* Connection status indicator */}
      <div className="mb-4">
        <ConnectionStatus status={connectionStatus} errorMessage={connectionError} />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Логин или Email
          </label>
          <input
            id="username"
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваш логин или email"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Пароль
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
            required
          />
          <div className="flex items-center pt-1">
            <input
              id="show-password"
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="show-password" className="ml-2 text-xs text-gray-600">
              Показать пароль
            </label>
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="p-3 text-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading || connectionStatus === 'error'}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Вход...
            </span>
          ) : (
            "Войти"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm; // Keep default export for backward compatibility
