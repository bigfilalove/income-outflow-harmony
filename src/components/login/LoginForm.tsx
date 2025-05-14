
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CardContent, CardFooter } from '@/components/ui/card';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithCredentials, currentUser } = useAuth();
  const navigate = useNavigate();

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

  return (
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
  );
};
