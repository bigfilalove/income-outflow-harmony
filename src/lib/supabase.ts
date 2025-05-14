
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// Используем значения из интегрированного Supabase клиента
const supabaseUrl = 'https://rjumbzllcnboghomakdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdW1iemxsY25ib2dob21ha2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODgwMzUsImV4cCI6MjA1OTc2NDAzNX0.y67rxShDBronCSG4R_7HSvty3pD1zEj431fbUCrO174';

// Создаем Supabase клиент с явной конфигурацией
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'finance-tracker-auth',
    storage: localStorage,
    debug: process.env.NODE_ENV === 'development'
  }
});

// Add a getUrl method to make the URL accessible
supabase.getUrl = () => supabaseUrl;

// Добавляем хелпер для проверки соединения с Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Проверка соединения с Supabase...');
    
    // Сначала проверяем, можем ли мы достичь Supabase вообще
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Ошибка получения сессии из Supabase:', sessionError.message);
      return false;
    }
    
    // Затем проверяем, можем ли мы запросить таблицу
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count()', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        console.error('Ошибка соединения с таблицей категорий Supabase:', error.message);
        return false;
      }
    } catch (tableError) {
      console.error('Ошибка запроса к таблице Supabase:', tableError);
      
      // Пробуем другую таблицу
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('count()', { count: 'exact', head: true })
          .limit(1);
        
        if (error) {
          console.error('Ошибка соединения с таблицей транзакций Supabase:', error.message);
          return false;
        }
      } catch (err) {
        console.error('Фатальная ошибка соединения с любой таблицей Supabase:', err);
        return false;
      }
    }
    
    console.log('Успешно подключено к Supabase');
    return true;
  } catch (error) {
    console.error('Фатальная ошибка подключения к Supabase:', error);
    return false;
  }
};

// Функция для получения текущей сессии
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Ошибка получения текущей сессии:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Ошибка получения текущей сессии:', error);
    return null;
  }
};
