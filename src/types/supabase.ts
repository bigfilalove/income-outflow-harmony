
import { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend the SupabaseClient type to include the getUrl method
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database, SchemaName extends string & keyof Database, Schema> {
    getUrl(): string;
  }
}

// You can also define custom types for your Supabase client here
export type TypedSupabaseClient = SupabaseClient<Database>;
