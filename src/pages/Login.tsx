
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, ShieldIcon, KeyIcon, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkSupabaseConnection } from '@/lib/supabase';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { loginWithCredentials, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setConnectionError('Не удалось подключиться к Supabase. Проверьте настройки соединения.');
      }
    };
    
    verifyConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { username, password: '********' });
      const success = await loginWithCredentials(username, password);
      
      if (success) {
        toast.success(`Добро пожаловать!`);
        console.log('Login successful, currentUser:', currentUser);
        
        // Redirect with a delay to ensure currentUser is updated
        setTimeout(() => {
          if (currentUser?.role === 'admin') {
            navigate('/admin');
          } else if (currentUser?.role === 'user') {
            navigate('/transactions');
          } else if (currentUser?.role === 'basic') {
            navigate('/basic-transactions');
          } else {
            navigate('/');
          }
        }, 100);
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
    { username: 'accountant', password: 'password123', role: 'Бухгалтер' },
    { username: 'manager', password: 'password123', role: 'Менеджер' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход в систему</CardTitle>
          <CardDescription className="text-center">
            Введите ваш логин и пароль для входа
          </CardDescription>
        </CardHeader>

        {connectionError && (
          <div className="px-6 pb-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка соединения</AlertTitle>
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          </div>
        )}

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
                />
                <KeyIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
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
            <Button variant="outline" className="w-full" onClick={handleAdminLogin}>
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
