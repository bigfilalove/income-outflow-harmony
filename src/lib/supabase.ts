
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use the values directly from the integrated Supabase client
const supabaseUrl = 'https://rjumbzllcnboghomakdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdW1iemxsY25ib2dob21ha2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODgwMzUsImV4cCI6MjA1OTc2NDAzNX0.y67rxShDBronCSG4R_7HSvty3pD1zEj431fbUCrO174';

// Create Supabase client with explicit configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'finance-tracker-auth'
  }
});

// Add a helper to check if we're connected to Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('transactions').select('count()', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
};
