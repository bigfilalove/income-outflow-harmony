
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the Supabase connection is working
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    const { error } = await supabase.from('categories').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}

/**
 * Checks if the client has a valid auth session
 */
export async function checkAuthSession(): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    const { data, error } = await supabase.auth.getSession();
    return !error && !!data.session;
  } catch (error) {
    console.error('Auth session check failed:', error);
    return false;
  }
}
