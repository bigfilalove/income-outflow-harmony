
import { supabase } from '@/lib/supabase';

export const fetchCompaniesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchCompaniesFromSupabase:', error);
    throw error;
  }
};

export const createCompanyInSupabase = async (name: string) => {
  try {
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
  } catch (error) {
    console.error('Error in createCompanyInSupabase:', error);
    throw error;
  }
};

export const updateCompanyInSupabase = async (id: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateCompanyInSupabase:', error);
    throw error;
  }
};

export const deleteCompanyFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCompanyFromSupabase:', error);
    throw error;
  }
};
