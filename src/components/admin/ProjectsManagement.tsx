
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProjectsManagementProps {
  projects: string[];
  updateProjects: (projects: string[]) => void;
}

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ 
  projects, 
  updateProjects 
}) => {
  const [newProject, setNewProject] = useState('');

  const handleAddProject = () => {
    if (!newProject.trim()) {
      toast.error('Введите название проекта');
      return;
    }
    
    if (projects.includes(newProject.trim())) {
      toast.error('Такой проект уже существует');
      return;
    }
    
    const updatedProjects = [...projects, newProject.trim()];
    updateProjects(updatedProjects);
    setNewProject('');
    toast.success('Проект добавлен');
  };

  const handleRemoveProject = (project: string) => {
    const updatedProjects = projects.filter(p => p !== project);
    updateProjects(updatedProjects);
    toast.success('Проект удален');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление проектами</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Название проекта"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddProject}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Добавить
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название проекта</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      Нет проектов
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {project}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProject(project)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsManagement;
