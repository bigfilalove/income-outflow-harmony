
import React, { useState, useEffect } from 'react';
import { ProjectAllocation } from '@/types/transaction';
import { getProjects } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProjectAllocationsProps } from './types';
import ProjectAllocationItem from './ProjectAllocationItem';
import AllocationSummary from './AllocationSummary';
import AllocationWarnings from './AllocationWarnings';
import AllocationActions from './AllocationActions';

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
        
        <AllocationSummary 
          allocatedTotal={allocatedTotal} 
          remainingAmount={remainingAmount}
          editMode={editMode}
        />
      </div>
      
      {editMode && (
        <Card className="p-4">
          <AllocationWarnings 
            remainingAmount={remainingAmount}
            totalAmount={totalAmount}
            hasDuplicateProjects={hasDuplicateProjects}
          />
          
          <div className="space-y-2">
            {allocations.map((allocation, index) => (
              <ProjectAllocationItem 
                key={index}
                allocation={allocation}
                index={index}
                projects={projects}
                onUpdate={updateAllocation}
                onRemove={removeAllocation}
                disabled={allocations.length === 1}
                allocations={allocations}
              />
            ))}
            
            <AllocationActions 
              remainingAmount={remainingAmount}
              allocations={allocations}
              projects={projects}
              onChange={onChange}
              addAllocation={addAllocation}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProjectAllocations;
