
import { supabase } from '@/lib/supabase';

export const fetchProjectsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data || [];
};

export const createProjectInSupabase = async (name: string) => {
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
};

export const deleteProjectFromSupabase = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
  
  return true;
};
