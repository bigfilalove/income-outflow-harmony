
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Устанавливает роль администратора для пользователя по email или имени пользователя
 */
export const setAdminRoleForUser = async (emailOrUsername: string): Promise<boolean> => {
  try {
    console.log('[Supabase Users] Попытка присвоить роль админа для:', emailOrUsername);
    
    // Получаем список пользователей
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('[Supabase Users] Ошибка при получении списка пользователей:', usersError);
      return false;
    }
    
    // Найдем пользователя по email или username
    const user = users.users.find(u => 
      u.email === emailOrUsername || 
      u.email === `${emailOrUsername}@example.com` || 
      u.user_metadata?.username === emailOrUsername
    );
    
    if (!user) {
      console.error(`[Supabase Users] Пользователь с email/логином ${emailOrUsername} не найден`);
      toast.error(`Пользователь ${emailOrUsername} не найден`);
      return false;
    }
    
    console.log(`[Supabase Users] Найден пользователь для обновления:`, user);
    
    // Обновляем метаданные пользователя, устанавливая роль admin
    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = { ...currentMetadata, role: 'admin' };
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: updatedMetadata }
    );
    
    if (updateError) {
      console.error(`[Supabase Users] Ошибка при обновлении роли пользователя:`, updateError);
      return false;
    }
    
    console.log(`[Supabase Users] Пользователю ${emailOrUsername} успешно присвоена роль admin`);
    return true;
  } catch (error) {
    console.error('[Supabase Users] Ошибка при обновлении роли пользователя:', error);
    return false;
  }
};

/**
 * Получает список всех пользователей
 */
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('[Supabase Users] Ошибка при получении пользователей:', error);
      return [];
    }
    
    return data.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Пользователь',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      role: user.user_metadata?.role || 'user',
      createdAt: new Date(user.created_at)
    }));
  } catch (error) {
    console.error('[Supabase Users] Ошибка при получении пользователей:', error);
    return [];
  }
};
