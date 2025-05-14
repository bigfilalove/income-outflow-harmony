
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AtSign, Lock, User as UserIcon } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { addDemoUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the validation schema using zod
  const registerSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
    email: z.string().email('Введите корректный email адрес'),
    username: z.string().min(3, 'Имя пользователя должно содержать не менее 3 символов'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
  });
  
  type RegisterFormData = z.infer<typeof registerSchema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a new user using addDemoUser from auth context
      // Make sure all required fields are provided
      const result = await addDemoUser({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        role: 'user',
      });
      
      if (result) {
        toast.success('Регистрация успешна!');
        navigate('/login');
      } else {
        toast.error('Не удалось зарегистрировать пользователя');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Произошла ошибка при регистрации');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Или{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              войдите, если у вас уже есть аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Имя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="pl-10"
                  placeholder="Имя"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-10"
                  placeholder="Email адрес"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="username" className="sr-only">
                Имя пользователя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className="pl-10"
                  placeholder="Имя пользователя"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="pl-10"
                  placeholder="Пароль"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
