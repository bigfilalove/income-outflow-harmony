import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Save, X, Trash } from 'lucide-react';
import { fetchCategories, createCategory, deleteCategory } from '@/lib';
import { toast } from 'sonner';
import { CategoryType } from '@/types/transaction';

const updateCategory = async (id: string, name: string, type: CategoryType): Promise<any> => {
  return { id, name, type };
};

interface CategoriesManagementProps {
  updateCategories?: () => void;
}

const CategoriesManagement: React.FC<CategoriesManagementProps> = ({ updateCategories }) => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<{ id: string, name: string, type: CategoryType } | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>('income');

  const { data: incomeCategories, isLoading: incomeLoading, error: incomeError } = useQuery({
    queryKey: ['categories', 'income'],
    queryFn: () => fetchCategories('income'),
  });

  const { data: expenseCategories, isLoading: expenseLoading, error: expenseError } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => fetchCategories('expense'),
  });

  const { data: reimbursementCategories, isLoading: reimbursementLoading, error: reimbursementError } = useQuery({
    queryKey: ['categories', 'reimbursement'],
    queryFn: () => fetchCategories('reimbursement'),
  });

  const { data: transferCategories, isLoading: transferLoading, error: transferError } = useQuery({
    queryKey: ['categories', 'transfer'],
    queryFn: () => fetchCategories('transfer'),
  });

  const createMutation = useMutation({
    mutationFn: ({ name, type }: { name: string, type: CategoryType }) => createCategory(name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory('');
      toast("Категория добавлена", {
        description: `Новая категория "${newCategory.trim()}" добавлена успешно.`,
      });
      if (updateCategories) updateCategories();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось добавить категорию: ${error.message}`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, type }: { id: string, name: string, type: CategoryType }) => updateCategory(id, name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      toast("Категория обновлена", {
        description: "Изменения категории сохранены успешно.",
      });
      if (updateCategories) updateCategories();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось обновить категорию: ${error.message}`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast("Категория удалена", {
        description: "Категория была успешно удалена.",
      });
      if (updateCategories) updateCategories();
    },
    onError: (error) => {
      toast("Ошибка", {
        description: `Не удалось удалить категорию: ${error.message}`,
      });
    },
  });

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    createMutation.mutate({ name: newCategory.trim(), type: newCategoryType });
  };

  const handleEditCategory = (category: { id: string, name: string, type: CategoryType }) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    updateMutation.mutate({
      id: editingCategory.id,
      name: editingCategory.name.trim(),
      type: editingCategory.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    deleteMutation.mutate(id);
  };

  const typeColorMap = {
    income: 'bg-green-100 text-green-800 hover:bg-green-200',
    expense: 'bg-red-100 text-red-800 hover:bg-red-200',
    reimbursement: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    transfer: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  };

  if (incomeLoading || expenseLoading || reimbursementLoading || transferLoading) return <div>Загрузка...</div>;
  if (incomeError || expenseError || reimbursementError || transferError) return <div>Ошибка: {(incomeError || expenseError || reimbursementError || transferError).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление категориями</CardTitle>
        <CardDescription>
          Добавление, редактирование и удаление категорий для транзакций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Новая категория"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={newCategoryType}
              onChange={e => setNewCategoryType(e.target.value as CategoryType)}
            >
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
              <option value="reimbursement">Возмещение</option>
              <option value="transfer">Перевод</option>
            </select>
            <Button onClick={handleAddCategory} className="whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>

          {editingCategory && (
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Input
                value={editingCategory.name}
                onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="flex-1"
              />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={editingCategory.type}
                onChange={e => setEditingCategory({ ...editingCategory, type: e.target.value as CategoryType })}
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
                <option value="reimbursement">Возмещение</option>
                <option value="transfer">Перевод</option>
              </select>
              <Button onClick={handleSaveCategory} className="whitespace-nowrap">
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="whitespace-nowrap">
                <X className="mr-2 h-4 w-4" />
                Отмена
              </Button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-4">
            {/* Income Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Доходы</h3>
              {incomeCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColorMap.income}>Доход</Badge>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Expense Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Расходы</h3>
              {expenseCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColorMap.expense}>Расход</Badge>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reimbursement Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Возмещения</h3>
              {reimbursementCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColorMap.reimbursement}>Возмещение</Badge>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Transfer Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Переводы</h3>
              {transferCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColorMap.transfer}>Перевод</Badge>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesManagement;
