
import React from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { UserCircle, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface UsersListProps {
  users: User[];
  removeUser: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, removeUser }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Админ</Badge>;
      case 'user':
        return <Badge className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">Пользователь</Badge>;
      case 'basic':
        return <Badge className="bg-muted/80 text-muted-foreground hover:bg-muted">Базовый</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Список пользователей</h3>
      <div className="rounded-md border">
        <div className="divide-y">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <UserCircle className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRoleBadge(user.role)}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserX className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие невозможно отменить. Пользователь будет удален из системы.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        removeUser(user.id);
                        toast.success('Пользователь удален');
                      }}>
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
