
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

interface UsersListProps {
  users: User[];
  removeUser: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, removeUser }) => {
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
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'
                }`}>
                  {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                </span>
                
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
