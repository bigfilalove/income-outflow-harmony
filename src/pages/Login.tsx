
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, ShieldIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const { users, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      login(user.id);
      toast.success(`Добро пожаловать, ${user.name}!`);
      navigate('/');
    } else {
      toast.error('Пользователь не найден');
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход в систему</CardTitle>
          <CardDescription className="text-center">
            Введите ваш email для входа
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                />
                <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">
              Войти
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
    </div>
  );
};

export default Login;
