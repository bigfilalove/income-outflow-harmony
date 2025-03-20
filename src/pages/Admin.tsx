import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, KeyIcon, UserX, UserCircle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User } from '@/types/user';

const Admin = () => {
  const { users, addUser, removeUser, updateAdminPassword, adminPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Create user form schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Имя должно содержать минимум 2 символа',
    }),
    email: z.string().email({
      message: 'Введите корректный email',
    }),
    role: z.enum(['admin', 'user']),
  });

  // Define the type for the form values
  type FormValues = z.infer<typeof formSchema>;

  // Form for creating a new user
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  const onSubmit = (values: FormValues) => {
    addUser(values);
    toast.success('Пользователь успешно добавлен');
    form.reset();
  };

  // Handle password change
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>Добавление и удаление пользователей системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User list */}
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

              {/* Add user dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusCircleIcon className="mr-2 h-4 w-4" /> Добавить пользователя
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить пользователя</DialogTitle>
                    <DialogDescription>
                      Создайте нового пользователя системы
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Введите имя" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="example@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Роль</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                {...field}
                              >
                                <option value="user">Пользователь</option>
                                <option value="admin">Администратор</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Создать пользователя</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

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
        </div>
      </main>
    </div>
  );
};

export default Admin;
