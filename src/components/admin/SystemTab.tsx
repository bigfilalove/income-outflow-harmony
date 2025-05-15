
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PasswordManagement, { PasswordManagementProps } from './PasswordManagement';

interface SystemTabProps extends PasswordManagementProps {}

const SystemTab: React.FC<SystemTabProps> = ({ adminPassword, updateAdminPassword }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Системные настройки</CardTitle>
          <CardDescription>
            Управление системными настройками приложения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Управление паролем</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Изменение пароля администратора
            </p>
            <Separator className="my-4" />
            <PasswordManagement 
              adminPassword={adminPassword} 
              updateAdminPassword={updateAdminPassword} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTab;
