
import React, { useState } from 'react';
import { toast } from 'sonner';
import { KeyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface PasswordManagementProps {
  adminPassword: string;
  updateAdminPassword: (newPassword: string) => void;
}

const PasswordManagement: React.FC<PasswordManagementProps> = ({ 
  adminPassword, 
  updateAdminPassword 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    updateAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Пароль успешно изменен');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Безопасность</CardTitle>
        <CardDescription>Изменение пароля администратора</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Изменить пароль</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Текущий пароль</label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  value={adminPassword} 
                  disabled 
                  className="bg-muted"
                />
                <KeyIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Новый пароль</label>
              <Input
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Подтвердите пароль</label>
              <Input
                type="password"
                placeholder="Подтвердите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              className="w-full"
            >
              Изменить пароль
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordManagement;
