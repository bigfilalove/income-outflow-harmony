
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, ShieldIcon, KeyIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkSupabaseConnection } from '@/lib/supabase';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>("connected"); // Default to connected to avoid UI blocking
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { loginWithCredentials, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        if (isConnected) {
          setConnectionStatus('connected');
          setConnectionError(null);
        } else {
          console.log("Connection error with Supabase, but allowing login with demo accounts");
          setConnectionStatus('error');
          setConnectionError('Не удалось подключиться к Supabase. Вы можете использовать тестовые аккаунты для входа.');
        }
      } catch (error) {
        console.error("Connection check error:", error);
        console.log("Connection error with Supabase, but allowing login with demo accounts");
        setConnectionStatus('error');
        setConnectionError('Ошибка при проверке соединения с Supabase. Вы можете использовать тестовые аккаунты для входа.');
      }
    };
    
    verifyConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We allow login regardless of Supabase connection status
    // because we have demo accounts that work without Supabase
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { username, password: '********' });
      const success = await loginWithCredentials(username, password);
      
      if (success) {
        toast.success(`Добро пожаловать!`);
        console.log('Login successful, redirecting based on role');
        
        // Get the current user from context after it has been set
        const userRole = currentUser?.role || localStorage.getItem('finance-tracker-user') 
          ? JSON.parse(localStorage.getItem('finance-tracker-user') || '{}').role 
          : null;
          
        console.log('User role for redirection:', userRole);
        
        // Redirect based on role
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'user') {
          navigate('/transactions');
        } else if (userRole === 'basic') {
          navigate('/basic-transactions');
        } else {
          navigate('/');
        }
      } else {
        toast.error("Неверное имя пользователя или пароль");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Ошибка при входе. Проверьте ваши учетные данные.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  // Demo accounts for testing
  const testAccounts = [
    { username: 'admin', password: 'password123', role: 'Администратор' },
    { username: 'user', password: 'password123', role: 'Пользователь' },
    { username: 'basic', password: 'password123', role: 'Базовый пользователь' },
    { username: 'accountant', password: 'password123', role: 'Бухгалтер' },
    { username: 'manager', password: 'password123', role: 'Менеджер' }
  ];

  // Connection status component
  const renderConnectionStatus = () => {
    if (connectionStatus === 'checking') {
      return (
        <div className="px-6 pb-2">
          <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
            <div className="h-4 w-4 rounded-full bg-muted"></div>
            <span>Проверка соединения с Supabase...</span>
          </div>
        </div>
      );
    } else if (connectionStatus === 'error') {
      return (
        <div className="px-6 pb-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Примечание</AlertTitle>
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        </div>
      );
    } else {
      return (
        <div className="px-6 pb-2">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Подключение к Supabase установлено</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход в систему</CardTitle>
          <CardDescription className="text-center">
            Введите ваш логин и пароль для входа
          </CardDescription>
        </CardHeader>

        {renderConnectionStatus()}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  required
                  disabled={isLoading}
                />
                <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                  disabled={isLoading}
                />
                <KeyIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
            <div className="relative w-full text-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">или</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleAdminLogin} 
              disabled={isLoading}
            >
              <ShieldIcon className="mr-2 h-4 w-4" />
              Вход для администраторов
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Test account info */}
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
    </div>
  );
};

export default Login;
