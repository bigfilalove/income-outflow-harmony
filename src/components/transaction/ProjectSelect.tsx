
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { fetchProjectsFromSupabase } from '@/services/api/supabase/projects';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  projects?: { id: string, name: string }[] | string[];
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange, projects: propProjects }) => {
  // Fetch projects from Supabase
  const { data: fetchedProjects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectsFromSupabase,
  });
  
  const [projectsList, setProjectsList] = useState<string[]>([]);
  
  useEffect(() => {
    // If projects are provided via props, use them
    if (propProjects) {
      if (typeof propProjects[0] === 'string') {
        setProjectsList(propProjects as string[]);
      } else {
        // Handle object format projects
        const projectNames = (propProjects as { id: string, name: string }[]).map(p => p.name);
        setProjectsList(projectNames);
      }
    } else if (fetchedProjects) {
      // Use projects from Supabase
      const projectNames = fetchedProjects.map(p => p.name);
      setProjectsList(projectNames);
    }
  }, [propProjects, fetchedProjects]);

  if (isLoading) {
    return <div>Загрузка проектов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки проектов: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="project">Проект</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="project">
          <SelectValue placeholder="Выберите проект" />
        </SelectTrigger>
        <SelectContent>
          {projectsList.map((project, index) => (
            <SelectItem key={index} value={project}>
              {project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelect;
