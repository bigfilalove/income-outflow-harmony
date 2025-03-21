
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
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange }) => {
  // Список проектов для выбора (можно расширить или получать из API)
  const projects = [
    { id: "1", name: "Проект 1" },
    { id: "2", name: "Проект 2" },
    { id: "3", name: "Проект 3" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите проект" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectSelect;
