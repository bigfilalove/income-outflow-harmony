
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// Use the values from the integrated Supabase client
const supabaseUrl = 'https://rjumbzllcnboghomakdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdW1iemxsY25ib2dob21ha2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODgwMzUsImV4cCI6MjA1OTc2NDAzNX0.y67rxShDBronCSG4R_7HSvty3pD1zEj431fbUCrO174';

// Create Supabase client with explicit configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'finance-tracker-auth',
    debug: process.env.NODE_ENV === 'development'
  }
});

// Add a helper to check if we're connected to Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking Supabase connection...');
    
    // First check if we can reach Supabase at all
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session from Supabase:', sessionError.message);
      return false;
    }
    
    // Then check if we can query a table
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count()', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        console.error('Error connecting to Supabase categories table:', error.message);
        return false;
      }
    } catch (tableError) {
      console.error('Error querying Supabase table:', tableError);
      
      // Try another table
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('count()', { count: 'exact', head: true })
          .limit(1);
        
        if (error) {
          console.error('Error connecting to Supabase transactions table:', error.message);
          return false;
        }
      } catch (err) {
        console.error('Fatal error connecting to any Supabase table:', err);
        return false;
      }
    }
    
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Fatal error connecting to Supabase:', error);
    return false;
  }
};

// Add a function to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting current session:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};
