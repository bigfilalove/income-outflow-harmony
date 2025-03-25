// src/components/transaction/ImportTransactionsDialog.tsx
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { File, FileText, Upload, Check, AlertCircle } from 'lucide-react';
import { useTransactions } from '@/context/transaction';
import { Transaction, getTransactionCategories } from '@/types/transaction';
import { parseCSV, parseXML, categorizeTransactions } from '@/utils/importUtils';

interface Employee {
  id: string;
  fullName: string;
}

const ImportTransactionsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<'csv' | 'xml'>('csv');
  const [parsedData, setParsedData] = useState<Partial<Transaction>[]>([]);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [skippedTransactions, setSkippedTransactions] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categoriesStats, setCategoriesStats] = useState<Record<string, { category: string; count: number }[]>>({
    income: [],
    expense: [],
    reimbursement: [],
  });

  const { addTransaction, getCategoriesStats } = useTransactions();

  // Загружаем сотрудников и статистику категорий при открытии диалога
  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          const response = await fetch('/api/employees', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Ошибка при загрузке сотрудников:', error);
          setImportErrors(['Не удалось загрузить список сотрудников']);
        }
      };

      const loadCategoriesStats = async () => {
        try {
          const stats = await getCategoriesStats();
          setCategoriesStats(stats);
        } catch (error) {
          setImportErrors(['Не удалось загрузить статистику категорий. Категоризация может быть менее точной.']);
        }
      };

      fetchEmployees();
      loadCategoriesStats();
    }
  }, [isOpen, getCategoriesStats]);

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setImporting(false);
    setImportComplete(false);
    setImportErrors([]);
    setSelectedEmployee('');
    setSkippedTransactions([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImportComplete(false);
    setImportErrors([]);
    setSkippedTransactions([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) {
          throw new Error('Файл пустой');
        }
        const parsed = fileFormat === 'csv' ? parseCSV(content) : parseXML(content);
        const categorized = categorizeTransactions(parsed, categoriesStats);
        setParsedData(categorized);
      } catch (error) {
        console.error("Ошибка при парсинге файла:", error);
        setImportErrors([`Ошибка при парсинге файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`]);
      }
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const handleCategoryChange = (index: number, newCategory: string) => {
    setParsedData((prevData) =>
      prevData.map((transaction, i) =>
        i === index ? { ...transaction, category: newCategory } : transaction
      )
    );
  };

  const handleImport = async () => {
    if (parsedData.length === 0 || !selectedEmployee) return;

    setImporting(true);
    const errors: string[] = [];

    for (const transaction of parsedData) {
      try {
        if (
          typeof transaction.amount !== 'number' ||
          !transaction.description ||
          !transaction.category ||
          !transaction.type ||
          !['income', 'expense'].includes(transaction.type)
        ) {
          throw new Error('Некорректные данные транзакции');
        }

        await addTransaction({
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date || new Date(),
          type: transaction.type,
          isReimbursement: transaction.isReimbursement ?? false,
          reimbursedTo: transaction.reimbursedTo ?? null,
          reimbursementStatus: transaction.reimbursementStatus ?? null,
          createdBy: selectedEmployee,
          createdAt: transaction.createdAt || new Date(),
          company: transaction.company ?? null,
          project: transaction.project ?? null,
        });
      } catch (error) {
        errors.push(`Ошибка при импорте "${transaction.description}": ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    }

    setImportComplete(true);
    if (errors.length > 0) setImportErrors(errors);
    setImporting(false);
  };

  const handleClose = () => {
    if (!importing) {
      setIsOpen(false);
      resetState();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Импорт транзакций
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Импорт транзакций</DialogTitle>
        </DialogHeader>

        {importComplete ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-md">
              <Check className="h-6 w-6 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">
                Импорт завершен успешно: {parsedData.length - importErrors.length} из {parsedData.length} транзакций
              </p>
            </div>
            {importErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <p className="mb-2">Следующие транзакции не удалось импортировать:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {importErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleClose} className="w-full">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <Tabs defaultValue="csv" onValueChange={(value) => setFileFormat(value as 'csv' | 'xml')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="xml">XML</TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">Выберите CSV файл</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={importing}
                    />
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Формат CSV: Сумма в валюте счета;Назначение платежа;Тип операции (пополнение/списание) (значения: Credit/Debit или пополнение/списание);Категория операции;Дата транзакции;...
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="xml" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="xmlFile">Выберите XML файл</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="xmlFile"
                      type="file"
                      accept=".xml"
                      onChange={handleFileChange}
                      disabled={importing}
                    />
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    XML должен содержать теги: transaction, date, description, amount, type, category, isReimbursement, 
                    reimbursedTo, company, project
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {importErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <p className="mb-2">Обнаружены ошибки при парсинге файла:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {importErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {skippedTransactions.length > 0 && (
              <Alert variant="warning">
                <AlertDescription>
                  <p className="mb-2">Следующие транзакции были пропущены:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {skippedTransactions.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {parsedData.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="employee">ФИО сотрудника</Label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.fullName}>
                      {employee.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {parsedData.length > 0 && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Описание</TableHead>
                      <TableHead>Сумма (₽)</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 5).map((transaction, index) => {
                      const categoryType = transaction.isReimbursement ? 'reimbursement' : transaction.type || 'expense';
                      const availableCategories = getTransactionCategories()[categoryType] || [];
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium truncate max-w-[200px]" title={transaction.description}>
                            {transaction.description}
                          </TableCell>
                          <TableCell>{transaction.amount} ₽</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                              {transaction.type === 'income' ? 'Доход' : 'Расход'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <select
                              value={transaction.category || ''}
                              onChange={(e) => handleCategoryChange(index, e.target.value)}
                              className="p-1 border rounded-md"
                            >
                              {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>{transaction.date?.toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {parsedData.length > 5 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    И ещё {parsedData.length - 5} транзакций
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={importing}>
                Отмена
              </Button>
              <Button
                onClick={handleImport}
                disabled={parsedData.length === 0 || importing || !selectedEmployee}
              >
                {importing ? 'Импорт...' : `Импортировать ${parsedData.length} транзакций`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionsDialog;