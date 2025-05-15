
import { supabase } from '@/lib/supabase';

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export const fetchProjectsFromSupabase = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data?.map(project => ({
      id: project.id,
      name: project.name,
      createdAt: new Date(project.created_at)
    })) || [];
  } catch (error) {
    console.error('Error in fetchProjectsFromSupabase:', error);
    throw error;
  }
};

export const createProjectInSupabase = async (name: string): Promise<Project> => {
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
    
    return {
      id: data.id,
      name: data.name,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error in createProjectInSupabase:', error);
    throw error;
  }
};

export const deleteProjectFromSupabase = async (id: string): Promise<boolean> => {
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
