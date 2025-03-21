
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Save, X, Trash } from 'lucide-react';
import { 
  transactionCategories, 
  saveCategories, 
  getTransactionCategories 
} from '@/types/transaction';
import { toast } from 'sonner';

interface CategoriesManagementProps {
  updateCategories?: () => void;
}

const CategoriesManagement: React.FC<CategoriesManagementProps> = ({ updateCategories }) => {
  const [categories, setCategories] = useState(transactionCategories);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense' | 'reimbursement'>('income');

  const handleEditCategory = (type: string, index: number) => {
    setEditingType(type);
    setEditingIndex(index);
    setNewCategory(categories[type as keyof typeof categories][index]);
  };

  const handleSaveCategory = () => {
    if (!editingType || editingIndex === null || !newCategory.trim()) return;
    
    const updatedCategories = { ...categories };
    updatedCategories[editingType as keyof typeof categories][editingIndex] = newCategory.trim();
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    setEditingType(null);
    setEditingIndex(null);
    setNewCategory('');
    
    toast("Категория обновлена", {
      description: "Изменения категории сохранены успешно."
    });
    
    if (updateCategories) updateCategories();
  };

  const handleCancelEdit = () => {
    setEditingType(null);
    setEditingIndex(null);
    setNewCategory('');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = { ...categories };
    updatedCategories[newCategoryType].push(newCategory.trim());
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    setNewCategory('');
    
    toast("Категория добавлена", {
      description: `Новая категория "${newCategory.trim()}" добавлена успешно.`
    });
    
    if (updateCategories) updateCategories();
  };

  const handleDeleteCategory = (type: string, index: number) => {
    const updatedCategories = { ...categories };
    updatedCategories[type as keyof typeof categories].splice(index, 1);
    
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    toast("Категория удалена", {
      description: "Категория была успешно удалена."
    });
    
    if (updateCategories) updateCategories();
  };

  // Category type badge color map
  const typeColorMap = {
    income: 'bg-green-100 text-green-800 hover:bg-green-200',
    expense: 'bg-red-100 text-red-800 hover:bg-red-200',
    reimbursement: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  };

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
              onChange={e => setNewCategoryType(e.target.value as 'income' | 'expense' | 'reimbursement')}
            >
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
              <option value="reimbursement">Возмещение</option>
            </select>
            <Button onClick={handleAddCategory} className="whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>

          {/* Income Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Категории доходов</h3>
            <div className="flex flex-wrap gap-2">
              {categories.income.map((category, index) => (
                <div key={`income-${index}`} className="flex items-center">
                  {editingType === 'income' && editingIndex === index ? (
                    <div className="flex border rounded-md overflow-hidden">
                      <Input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="border-0 rounded-none"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" onClick={handleSaveCategory} className="px-2">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Badge className={typeColorMap.income}>
                      {category}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleEditCategory('income', index)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleDeleteCategory('income', index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Категории расходов</h3>
            <div className="flex flex-wrap gap-2">
              {categories.expense.map((category, index) => (
                <div key={`expense-${index}`} className="flex items-center">
                  {editingType === 'expense' && editingIndex === index ? (
                    <div className="flex border rounded-md overflow-hidden">
                      <Input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="border-0 rounded-none"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" onClick={handleSaveCategory} className="px-2">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Badge className={typeColorMap.expense}>
                      {category}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleEditCategory('expense', index)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleDeleteCategory('expense', index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reimbursement Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Категории возмещений</h3>
            <div className="flex flex-wrap gap-2">
              {categories.reimbursement.map((category, index) => (
                <div key={`reimbursement-${index}`} className="flex items-center">
                  {editingType === 'reimbursement' && editingIndex === index ? (
                    <div className="flex border rounded-md overflow-hidden">
                      <Input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        className="border-0 rounded-none"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" onClick={handleSaveCategory} className="px-2">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Badge className={typeColorMap.reimbursement}>
                      {category}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleEditCategory('reimbursement', index)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleDeleteCategory('reimbursement', index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
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
