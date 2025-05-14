
import { createClient } from '@supabase/supabase-js';
import { TypedSupabaseClient } from '@/types/supabase';

// Supabase URL and anon key from environment variables or fallback to defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rjumbzllcnboghomakdw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdW1iemxsY25ib2dob21ha2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI5NjU1NDgsImV4cCI6MTk5ODU0MTU0OH0.QQuHXmRNMDKGd6a-GNQVsnAZ-uK-p_4MsW7AZ0qVIrQ';

/**
 * Supabase client instance
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
}) as TypedSupabaseClient;

// Add the getUrl method to the client for compatibility
(supabase as any).getUrl = () => supabaseUrl;

/**
 * Check if there is a Supabase connection
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.from('transactions').select('count').limit(1);
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};
