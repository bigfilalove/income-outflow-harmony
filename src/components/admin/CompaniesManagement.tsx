
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { companies as defaultCompanies } from '@/types/transaction';

interface CompaniesManagementProps {
  companies: string[];
  updateCompanies: (companies: string[]) => void;
}

const CompaniesManagement: React.FC<CompaniesManagementProps> = ({ 
  companies, 
  updateCompanies 
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCompany, setNewCompany] = useState('');
  const [editCompany, setEditCompany] = useState('');

  const handleAddCompany = () => {
    if (newCompany.trim() && !companies.includes(newCompany.trim())) {
      updateCompanies([...companies, newCompany.trim()]);
      setNewCompany('');
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditCompany(companies[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditCompany('');
  };

  const handleSaveEdit = (index: number) => {
    if (editCompany.trim() && !companies.includes(editCompany.trim())) {
      const updatedCompanies = [...companies];
      updatedCompanies[index] = editCompany.trim();
      updateCompanies(updatedCompanies);
    }
    setEditingIndex(null);
  };

  const handleRemoveCompany = (index: number) => {
    const updatedCompanies = companies.filter((_, i) => i !== index);
    updateCompanies(updatedCompanies);
  };

  const handleResetToDefault = () => {
    updateCompanies([...defaultCompanies]);
  };

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

        <div className="border rounded-md divide-y">
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3">
                {editingIndex === index ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSaveEdit(index)}>
                      <Check size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{company}</span>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => handleStartEdit(index)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveCompany(index)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              Список компаний пуст
            </div>
          )}
        </div>

        {companies.length > 0 && (
          <Button variant="outline" onClick={handleResetToDefault} className="w-full">
            Сбросить к значениям по умолчанию
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompaniesManagement;
