import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { fetchCompanies, createCompany, updateCompany, deleteCompany } from '@/lib/companies';
import { toast } from 'sonner';

interface CompaniesManagementProps {
  updateCompanies?: () => void;
}

const CompaniesManagement: React.FC<CompaniesManagementProps> = ({ updateCompanies }) => {
  const queryClient = useQueryClient();
  const [editingCompany, setEditingCompany] = useState<{ id: string, name: string } | null>(null);
  const [newCompany, setNewCompany] = useState('');

  // Загружаем компании
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  // Мутация для добавления компании
  const createMutation = useMutation({
    mutationFn: (name: string) => createCompany(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setNewCompany('');
      toast("Компания добавлена", {
        description: `Новая компания "${newCompany.trim()}" добавлена успешно.`,
      });
      if (updateCompanies) updateCompanies();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось добавить компанию: ${error.message}`,
      });
    },
  });

  // Мутация для обновления компании
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => updateCompany(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setEditingCompany(null);
      toast("Компания обновлена", {
        description: "Изменения компании сохранены успешно.",
      });
      if (updateCompanies) updateCompanies();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось обновить компанию: ${error.message}`,
      });
    },
  });

  // Мутация для удаления компании
  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast("Компания удалена", {
        description: "Компания была успешно удалена.",
      });
      if (updateCompanies) updateCompanies();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось удалить компанию: ${error.message}`,
      });
    },
  });

  const handleAddCompany = () => {
    if (newCompany.trim() && !companies?.some(company => company.name === newCompany.trim())) {
      createMutation.mutate(newCompany.trim());
    }
  };

  const handleStartEdit = (company: { id: string, name: string }) => {
    setEditingCompany(company);
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
  };

  const handleSaveEdit = () => {
    if (editingCompany && editingCompany.name.trim() && !companies?.some(company => company.name === editingCompany.name.trim() && company.id !== editingCompany.id)) {
      updateMutation.mutate({ id: editingCompany.id, name: editingCompany.name.trim() });
    }
  };

  const handleRemoveCompany = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление компаниями</CardTitle>
        <CardDescription>Добавление, редактирование и удаление компаний для транзакций</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Название новой компании"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
          <Button onClick={handleAddCompany} size="sm">
            <Plus className="mr-1" size={16} />
            Добавить
          </Button>
        </div>

        {editingCompany && (
          <div className="flex items-center space-x-2">
            <Input
              value={editingCompany.name}
              onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              className="flex-1"
            />
            <Button onClick={handleSaveEdit} size="sm">
              <Check className="mr-1" size={16} />
              Сохранить
            </Button>
            <Button variant="outline" onClick={handleCancelEdit} size="sm">
              <X className="mr-1" size={16} />
              Отмена
            </Button>
          </div>
        )}

        <div className="border rounded-md divide-y">
          {companies?.length > 0 ? (
            companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3">
                <span>{company.name}</span>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => handleStartEdit(company)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCompany(company.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              Список компаний пуст
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompaniesManagement;
