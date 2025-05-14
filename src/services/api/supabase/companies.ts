
import { supabase } from '@/lib/supabase';

export const fetchCompaniesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
  
  return data || [];
};

export const createCompanyInSupabase = async (name: string) => {
  const { data, error } = await supabase
    .from('companies')
    .insert({ name })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }
  
  return data;
};
