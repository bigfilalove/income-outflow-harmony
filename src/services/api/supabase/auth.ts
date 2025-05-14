
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
