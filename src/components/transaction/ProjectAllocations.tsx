
import React, { useState, useEffect } from 'react';
import { ProjectAllocation } from '@/types/transaction';
import { getProjects } from '@/types/transaction';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectAllocationsProps {
  totalAmount: number;
  allocations: ProjectAllocation[];
  onChange: (allocations: ProjectAllocation[]) => void;
  onToggleAllocations: (enabled: boolean) => void;
}

const ProjectAllocations: React.FC<ProjectAllocationsProps> = ({ 
  totalAmount, 
  allocations, 
  onChange, 
  onToggleAllocations 
}) => {
  const [projects, setProjects] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<boolean>(allocations.length > 0);

  useEffect(() => {
    setProjects(getProjects());
    
    const handleProjectsUpdate = () => {
      setProjects(getProjects());
    };
    
    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, []);

  const addAllocation = () => {
    const availableProjects = projects.filter(
      project => !allocations.some(allocation => allocation.project === project)
    );
    
    if (availableProjects.length === 0) return;
    
    const newAllocation: ProjectAllocation = {
      project: availableProjects[0],
      amount: 0
    };
    
    onChange([...allocations, newAllocation]);
  };

  const removeAllocation = (index: number) => {
    const newAllocations = [...allocations];
    newAllocations.splice(index, 1);
    onChange(newAllocations);
    
    if (newAllocations.length === 0) {
      setEditMode(false);
      onToggleAllocations(false);
    }
  };

  const updateAllocation = (index: number, field: keyof ProjectAllocation, value: string | number) => {
    const newAllocations = [...allocations];
    
    if (field === 'amount') {
      newAllocations[index].amount = typeof value === 'number' ? value : parseFloat(value) || 0;
    } else if (field === 'project') {
      newAllocations[index].project = value as string;
    }
    
    onChange(newAllocations);
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    onToggleAllocations(newEditMode);
    
    // Если включаем режим распределения и нет аллокаций, добавляем первую
    if (newEditMode && allocations.length === 0) {
      addAllocation();
    } else if (!newEditMode) {
      // Если выключаем режим распределения, очищаем существующие аллокации
      onChange([]);
    }
  };

  // Расчет оставшейся нераспределенной суммы
  const allocatedTotal = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
  const remainingAmount = totalAmount - allocatedTotal;

  // Проверка наличия дублирующихся проектов
  const hasDuplicateProjects = allocations.length > new Set(allocations.map(a => a.project)).size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant={editMode ? "default" : "outline"} 
            size="sm" 
            onClick={toggleEditMode}
          >
            {editMode ? "Отключить распределение" : "Распределить по проектам"}
          </Button>
        </div>
        
        {editMode && (
          <div className="flex items-center space-x-1">
            <Badge variant={remainingAmount === 0 ? "success" : "outline"}>
              Распределено: {allocatedTotal.toLocaleString('ru-RU')} ₽
            </Badge>
            
            {remainingAmount !== 0 && (
              <Badge variant="destructive">
                Остаток: {remainingAmount.toLocaleString('ru-RU')} ₽
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {editMode && (
        <Card className="p-4">
          {remainingAmount !== 0 && (
            <Alert variant="default" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Общая сумма распределений должна быть равна {totalAmount.toLocaleString('ru-RU')} ₽
              </AlertDescription>
            </Alert>
          )}

          {hasDuplicateProjects && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Один проект используется несколько раз
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            {allocations.map((allocation, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={allocation.project}
                  onValueChange={(value) => updateAllocation(index, 'project', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите проект" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem
                        key={project}
                        value={project}
                        disabled={allocations.some((a, i) => i !== index && a.project === project)}
                      >
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="Сумма"
                  className="w-28"
                  min={0}
                  max={totalAmount}
                  value={allocation.amount || ''}
                  onChange={(e) => updateAllocation(index, 'amount', e.target.value)}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAllocation(index)}
                  disabled={allocations.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={addAllocation}
              disabled={projects.length <= allocations.length}
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить проект
            </Button>
          </div>
          
          {remainingAmount > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full mt-4"
              onClick={() => {
                if (allocations.length > 0) {
                  const newAllocations = [...allocations];
                  const lastIndex = newAllocations.length - 1;
                  newAllocations[lastIndex].amount += remainingAmount;
                  onChange(newAllocations);
                }
              }}
            >
              Добавить остаток к последнему проекту
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProjectAllocations;
