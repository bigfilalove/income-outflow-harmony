
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
import { fetchProjectsFromSupabase, Project } from '@/services/api/supabase/projects';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  projects?: Project[] | string[];
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange, projects: propProjects }) => {
  // Fetch projects from Supabase
  const { data: fetchedProjects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectsFromSupabase,
  });
  
  const [projectsList, setProjectsList] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    if (propProjects) {
      // If projects are provided via props, use them
      if (typeof propProjects[0] === 'string') {
        // Handle string array format
        const formattedProjects = (propProjects as string[]).map((name, index) => ({
          id: String(index),
          name
        }));
        setProjectsList(formattedProjects);
      } else {
        // Handle Project object format
        setProjectsList(propProjects as Project[]);
      }
    } else if (fetchedProjects) {
      // Use projects from Supabase
      setProjectsList(fetchedProjects);
    }
  }, [propProjects, fetchedProjects]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Загрузка проектов...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>Ошибка загрузки проектов: {(error as Error).message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="project">Проект</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="project">
          <SelectValue placeholder="Выберите проект" />
        </SelectTrigger>
        <SelectContent>
          {projectsList.length === 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">Нет доступных проектов</div>
          ) : (
            projectsList.map((project) => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelect;
