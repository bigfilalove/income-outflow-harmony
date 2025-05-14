
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

// Проверка текущей сессии/аутентификации
export const checkAuthSupabase = async (): Promise<User | null> => {
  try {
    console.log('[Supabase Auth] Проверка состояния аутентификации...');
    
    // Получаем сессию из Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('[Supabase Auth] Активная сессия Supabase найдена:', session.user.id);
      const { user: supabaseUser } = session;
      
      // Возвращаем данные пользователя
      const userRole = (supabaseUser.user_metadata.role as 'admin' | 'user' | 'basic') || 'basic';
      
      const user: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        username: supabaseUser.email?.split('@')[0] || '',
        password: '', // Мы не храним и не возвращаем пароль
        role: userRole,
        createdAt: new Date(supabaseUser.created_at)
      };
      
      return user;
    }
    
    console.log('[Supabase Auth] Аутентификация не найдена');
    return null;
  } catch (error) {
    console.error('[Supabase Auth] Ошибка при проверке состояния аутентификации:', error);
    return null;
  }
};

// Добавление функции для обновления метаданных пользователя
export const updateUserMetadata = async (userId: string, metadata: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    );
    
    if (error) {
      console.error('[Supabase Auth] Ошибка при обновлении метаданных пользователя:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Supabase Auth] Ошибка при обновлении метаданных пользователя:', error);
    return false;
  }
};

// Функция для проверки и обновления роли пользователя по email
export const setUserRoleByEmail = async (email: string, role: 'admin' | 'user' | 'basic'): Promise<boolean> => {
  try {
    // Получаем пользователя по email
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('[Supabase Auth] Ошибка при получении списка пользователей:', usersError);
      return false;
    }
    
    // Находим пользователя по email
    const user = users.users.find(u => u.email === email || u.email === `${email}@example.com`);
    
    if (!user) {
      console.error(`[Supabase Auth] Пользователь с email ${email} не найден`);
      return false;
    }
    
    // Обновляем метаданные пользователя, добавляя роль
    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = { ...currentMetadata, role };
    
    // Обновляем метаданные пользователя
    const updated = await updateUserMetadata(user.id, updatedMetadata);
    
    if (updated) {
      console.log(`[Supabase Auth] Пользователю ${email} присвоена роль ${role}`);
      return true;
    } else {
      console.error(`[Supabase Auth] Не удалось присвоить роль ${role} пользователю ${email}`);
      return false;
    }
  } catch (error) {
    console.error('[Supabase Auth] Ошибка при обновлении роли пользователя:', error);
    return false;
  }
};
