
import { supabase } from '@/lib/supabase';

export const fetchProjectsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchProjectsFromSupabase:', error);
    throw error;
  }
};

export const createProjectInSupabase = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createProjectInSupabase:', error);
    throw error;
  }
};

export const deleteProjectFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProjectFromSupabase:', error);
    throw error;
  }
};
