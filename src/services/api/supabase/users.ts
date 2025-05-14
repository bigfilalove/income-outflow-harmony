
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { setUserRoleByEmail } from './auth';

// Получить список пользователей
export const fetchUsersFromSupabase = async (): Promise<User[]> => {
  try {
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      return [];
    }
    
    return usersData.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: '', // Не возвращаем пароль
      role: (user.role as 'admin' | 'user' | 'basic') || 'basic',
      createdAt: new Date(user.created_at)
    }));
  } catch (error) {
    console.error('Ошибка API при получении пользователей:', error);
    return [];
  }
};

// Присвоить пользователю роль администратора
export const setAdminRoleForUser = async (emailOrUsername: string): Promise<boolean> => {
  try {
    // Пробуем установить роль через Supabase Auth
    const result = await setUserRoleByEmail(emailOrUsername, 'admin');
    
    if (result) {
      toast.success(`Пользователю ${emailOrUsername} успешно присвоена роль администратора`);
      return true;
    }
    
    // Если не удалось через Auth API, пробуем через таблицу пользователей
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
      .single();
    
    if (userError || !userData) {
      console.error(`Пользователь ${emailOrUsername} не найден`, userError);
      toast.error(`Пользователь ${emailOrUsername} не найден`);
      return false;
    }
    
    // Обновляем роль пользователя в таблице
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userData.id);
    
    if (updateError) {
      console.error('Ошибка при обновлении роли пользователя:', updateError);
      toast.error('Не удалось присвоить роль администратора');
      return false;
    }
    
    toast.success(`Пользователю ${emailOrUsername} успешно присвоена роль администратора`);
    return true;
  } catch (error) {
    console.error('Ошибка при присвоении роли администратора:', error);
    toast.error('Произошла ошибка при присвоении роли администратора');
    return false;
  }
};
