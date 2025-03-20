
import React from 'react';
import { User } from '@/types/user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UsersList from './UsersList';
import AddUserDialog from './AddUserDialog';

interface UsersManagementProps {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  removeUser: (userId: string) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ 
  users, 
  addUser, 
  removeUser 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление пользователями</CardTitle>
        <CardDescription>Добавление и удаление пользователей системы</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsersList users={users} removeUser={removeUser} />
        <AddUserDialog addUser={addUser} />
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
