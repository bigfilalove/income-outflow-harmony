
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyholeIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  
  // Фиксированный пароль для доступа к админ панели
  const adminPassword = '123456';
  
  // Демо учетные данные администратора
  const adminCredentials = {
    username: 'ivanp',
    password: 'password123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminPassword) {
      try {
        // Выполняем логин как администратор с предустановленными учетными данными
        const success = await loginWithCredentials(adminCredentials.username, adminCredentials.password);
        
        if (success) {
          toast({
            title: "Вход выполнен успешно",
            description: "Вы вошли как администратор"
          });
          navigate('/admin');
        } else {
          toast({
            title: "Ошибка при входе",
            description: "Не удалось войти с учетными данными администратора",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Ошибка входа:', error);
        toast({
          title: "Ошибка при входе",
          description: "Произошла ошибка при попытке входа",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Неверный пароль",
        description: "Пароль администратора неверен",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход в админ панель</CardTitle>
          <CardDescription className="text-center">
            Введите пароль для доступа к панели администратора
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль администратора</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <LockKeyholeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
