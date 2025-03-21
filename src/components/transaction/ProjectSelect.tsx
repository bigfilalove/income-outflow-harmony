
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  projects?: { id: string, name: string }[] | string[];
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange, projects }) => {
  // Default projects list if none provided
  const defaultProjects = [
    { id: "1", name: "Проект 1" },
    { id: "2", name: "Проект 2" },
    { id: "3", name: "Проект 3" }
  ];

  // Use provided projects or default to predefined list
  const projectsToUse = projects || defaultProjects;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите проект" />
      </SelectTrigger>
      <SelectContent>
        {Array.isArray(projectsToUse) && projectsToUse.map((project, index) => {
          // Handle both object format and string format
          if (typeof project === 'string') {
            return (
              <SelectItem key={index} value={project}>
                {project}
              </SelectItem>
            );
          } else {
            return (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            );
          }
        })}
      </SelectContent>
    </Select>
  );
};

export default ProjectSelect;
