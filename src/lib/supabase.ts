
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase URL и anon key, которые вы получите при создании проекта
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Создаем Supabase клиент
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
