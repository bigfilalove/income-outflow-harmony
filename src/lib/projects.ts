
import { fetchProjectsFromSupabase } from '@/services/api/supabase/projects';

// Local storage keys
const PROJECTS_STORAGE_KEY = 'financeTracker:projects';

// Utility functions to get and save projects in local storage (as fallback)
export const getProjects = (): string[] => {
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error getting projects from local storage:', error);
    return [];
  }
};

export const saveProjects = (projects: string[]): void => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event('projectsUpdated'));
  } catch (error) {
    console.error('Error saving projects to local storage:', error);
  }
};

// For migration purposes - will fetch from Supabase and update local storage
export const syncProjectsWithSupabase = async (): Promise<void> => {
  try {
    const supabaseProjects = await fetchProjectsFromSupabase();
    const projectNames = supabaseProjects.map(p => p.name);
    
    // Merge with existing local projects to avoid losing data
    const localProjects = getProjects();
    const mergedProjects = [...new Set([...localProjects, ...projectNames])];
    
    saveProjects(mergedProjects);
  } catch (error) {
    console.error('Error syncing projects with Supabase:', error);
  }
};
