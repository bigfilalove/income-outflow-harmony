
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getProjects, saveProjects } from '@/types/transaction';
import { LandmarkIcon } from 'lucide-react';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange }) => {
  const [projects, setProjects] = useState<string[]>(getProjects());
  const [otherProject, setOtherProject] = useState('');
  const [isOther, setIsOther] = useState(false);

  // Обработка обновления списка проектов
  useEffect(() => {
    const handleProjectsUpdate = () => {
      setProjects(getProjects());
    };
    
    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, []);

  // При загрузке компонента проверяем, является ли текущее значение "Другой"
  useEffect(() => {
    if (value && !projects.includes(value) && value !== 'Другой') {
      setOtherProject(value);
      setIsOther(true);
    } else {
      setIsOther(value === 'Другой');
    }
  }, [value, projects]);

  // Обработчик выбора проекта
  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'Другой') {
      setIsOther(true);
      onChange('Другой');
    } else {
      setIsOther(false);
      onChange(selectedValue);
    }
  };

  // Обработчик ввода нового проекта
  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setOtherProject(newValue);
    onChange(newValue);
    
    // Сохраняем новый проект в список после ввода
    if (newValue.trim() && !projects.includes(newValue)) {
      const updatedProjects = [...projects];
      if (!updatedProjects.includes(newValue) && newValue !== 'Другой') {
        updatedProjects.push(newValue);
        saveProjects(updatedProjects);
        setProjects(updatedProjects);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="project" className="flex items-center">
        <LandmarkIcon className="mr-1 h-4 w-4" />
        Проект (необязательно)
      </Label>
      <Select
        value={isOther ? 'Другой' : value}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger id="project">
          <SelectValue placeholder="Выберите проект" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Не указан</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project} value={project}>
              {project}
            </SelectItem>
          ))}
          <SelectItem value="Другой">Другой</SelectItem>
        </SelectContent>
      </Select>

      {isOther && (
        <Input
          placeholder="Введите название проекта"
          value={otherProject}
          onChange={handleOtherChange}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default ProjectSelect;
