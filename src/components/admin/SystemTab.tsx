
import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { checkAndNotifySupabaseConnection } from '@/utils/supabaseConnectionCheck';
import PasswordManagement from './PasswordManagement';

interface SystemTabProps {
  adminPassword: string;
  updateAdminPassword: (newPassword: string) => void;
}

const SystemTab: React.FC<SystemTabProps> = ({ 
  adminPassword, 
  updateAdminPassword 
}) => {
  const handleCheckConnection = async () => {
    const isConnected = await checkAndNotifySupabaseConnection();
    if (isConnected) {
      toast.success('Соединение с Supabase установлено');
    } else {
      toast.error('Ошибка соединения с Supabase');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

export default SystemTab;
