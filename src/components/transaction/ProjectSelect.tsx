import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProjects } from '@/types/transaction';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  projects?: { id: string, name: string }[] | string[];
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange, projects: propProjects }) => {
  const [projectsList, setProjectsList] = useState<string[]>([]);
  
  useEffect(() => {
    // If projects are provided via props, use them
    if (propProjects) {
      if (typeof propProjects[0] === 'string') {
        setProjectsList(propProjects as string[]);
      } else {
        // Handle object format projects if needed
        const projectNames = (propProjects as { id: string, name: string }[]).map(p => p.name);
        setProjectsList(projectNames);
      }
    } else {
      // Otherwise fetch from localStorage
      setProjectsList(getProjects());
    }
  }, [propProjects]);

  // Listen for projects updates from other components
  useEffect(() => {
    const handleProjectsUpdate = () => {
      if (!propProjects) {
        setProjectsList(getProjects());
      }
    };
    
    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, [propProjects]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
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
  );
};

export default ProjectSelect;
