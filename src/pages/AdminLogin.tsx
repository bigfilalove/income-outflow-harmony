
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyholeIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const { verifyAdminPassword, users, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyAdminPassword(password)) {
      // Находим пользователя с ролью админа для автоматического входа
      const adminUser = users.find(user => user.role === 'admin');
      
      if (adminUser) {
        // Выполняем логин как админ
        login(adminUser.id);
        toast.success('Вход выполнен успешно');
        navigate('/admin');
      } else {
        toast.error('Ошибка: администратор не найден в системе');
      }
    } else {
      toast.error('Неверный пароль');
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
