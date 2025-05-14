import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithCredentials, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const success = await loginWithCredentials(username, password);
      if (success) {
        // The AuthContext should handle navigation based on user role
        console.log('Login successful, navigating...');
      } else {
        // loginWithCredentials should handle error messages via toast
        console.log('Login failed, check credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Не удалось войти в систему. Пожалуйста, попробуйте позже.');
      toast({
        title: "Ошибка при входе в систему",
        description: "Неверные учетные данные",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-0">
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
        <Button type="submit" className="w-full" disabled={isLoading}>
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
