
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchProjectsFromSupabase, createProjectInSupabase, deleteProjectFromSupabase } from '@/services/api/supabase/projects';

const ProjectsManagement: React.FC = () => {
  const [newProject, setNewProject] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectsFromSupabase
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: createProjectInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProject('');
      toast.success('Проект добавлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при добавлении проекта: ${error.message}`);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectFromSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Проект удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении проекта: ${error.message}`);
    }
  });

  const handleAddProject = () => {
    if (!newProject.trim()) {
      toast.error('Введите название проекта');
      return;
    }
    
    if (projects.some(p => p.name === newProject.trim())) {
      toast.error('Такой проект уже существует');
      return;
    }
    
    addProjectMutation.mutate(newProject.trim());
  };

  const handleRemoveProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Управление проектами</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Загрузка проектов...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Управление проектами</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>
              Не удалось загрузить проекты: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
              disabled={addProjectMutation.isPending}
            >
              {addProjectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
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
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {project.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProject(project.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          disabled={deleteProjectMutation.isPending}
                        >
                          {deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
