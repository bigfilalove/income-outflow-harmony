import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UsersManagement from '@/components/admin/UsersManagement';
import { checkSupabaseConnection } from '@/lib/supabase';
import { checkAndNotifySupabaseConnection } from '@/utils/supabaseConnectionCheck';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { 
    demoUsersList, 
    addDemoUser, 
    removeDemoUser, 
    adminPassword, 
    updateAdminPassword 
  } = useAdmin();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCheckConnection = async () => {
    const isConnected = await checkAndNotifySupabaseConnection();
    if (isConnected) {
      toast.success('Соединение с Supabase установлено');
    } else {
      toast.error('Ошибка соединения с Supabase');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Административная панель | Финансовый трекер</title>
      </Helmet>
      
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Административная панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Управление пользователями */}
          <UsersManagement 
            users={demoUsersList} 
            addUser={addDemoUser} 
            removeUser={removeDemoUser} 
          />
          
          {/* Управление паролем администратора */}
          <PasswordManagement 
            currentPassword={adminPassword} 
            updatePassword={updateAdminPassword} 
          />
          
          {/* Диагностика Supabase */}
          <Card>
            <CardHeader>
              <CardTitle>Диагностика Supabase</CardTitle>
              <CardDescription>Проверка соединения с базой данных</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Нажмите кнопку ниже, чтобы проверить соединение с Supabase.
              </p>
              <Button onClick={handleCheckConnection}>
                Проверить соединение
              </Button>
            </CardContent>
          </Card>
          
          {/* Системная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Системная информация</CardTitle>
              <CardDescription>Информация о системе и окружении</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Режим:</span>
                  <span className="font-medium">{import.meta.env.MODE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Версия:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">База данных:</span>
                  <span className="font-medium">Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Проект:</span>
                  <span className="font-medium">rjumbzllcnboghomakdw</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Компонент для управления паролем администратора
const PasswordManagement = ({ 
  currentPassword, 
  updatePassword 
}: { 
  currentPassword: string; 
  updatePassword: (newPassword: string) => void 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    updatePassword(newPassword);
    toast.success('Пароль администратора обновлен');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пароль администратора</CardTitle>
        <CardDescription>Изменение пароля для входа в админ панель</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Текущий пароль</Label>
            <Input
              id="current-password"
              type="text"
              value={currentPassword}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Новый пароль</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Подтвердите пароль</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Обновить пароль</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Admin;
