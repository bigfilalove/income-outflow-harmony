
import React, { useState } from 'react';
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

const ImportTransactionsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<'csv' | 'xml'>('csv');
  const [parsedData, setParsedData] = useState<Partial<Transaction>[]>([]);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  
  const { addTransaction } = useTransactions();

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setImporting(false);
    setImportComplete(false);
    setImportErrors([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportComplete(false);
      setImportErrors([]);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let parsed: Partial<Transaction>[] = [];
          
          if (fileFormat === 'csv') {
            parsed = parseCSV(content);
          } else {
            parsed = parseXML(content);
          }
          
          // Автоматически категоризируем транзакции
          const categorized = categorizeTransactions(parsed);
          setParsedData(categorized);
        } catch (error) {
          console.error("Ошибка при парсинге файла:", error);
          setImportErrors([`Ошибка при парсинге файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`]);
        }
      };
      
      if (fileFormat === 'csv') {
        reader.readAsText(e.target.files[0]);
      } else {
        reader.readAsText(e.target.files[0]);
      }
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setImporting(true);
    const errors: string[] = [];
    
    try {
      // Импортируем каждую транзакцию последовательно
      for (const transaction of parsedData) {
        try {
          if (
            typeof transaction.amount === 'number' &&
            transaction.description &&
            transaction.category &&
            transaction.type
          ) {
            await addTransaction({
              amount: transaction.amount,
              description: transaction.description,
              category: transaction.category,
              date: transaction.date || new Date(),
              type: transaction.type,
              isReimbursement: transaction.isReimbursement || false,
              reimbursedTo: transaction.reimbursedTo,
              company: transaction.company,
              project: transaction.project
            });
          } else {
            throw new Error(`Неполные данные для транзакции: ${transaction.description}`);
          }
        } catch (error) {
          console.error("Ошибка при импорте транзакции:", error);
          errors.push(`Ошибка при импорте "${transaction.description}": ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
      }
      
      setImportComplete(true);
      if (errors.length > 0) {
        setImportErrors(errors);
      }
    } catch (error) {
      console.error("Ошибка при импорте транзакций:", error);
      setImportErrors([`Ошибка при импорте транзакций: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`]);
    } finally {
      setImporting(false);
    }
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
                    Формат CSV: дата,описание,сумма,тип,категория,возмещение,кому_возмещено,компания,проект
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
            
            {parsedData.length > 0 && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Описание</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Категория</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 5).map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                            {transaction.type === 'income' ? 'Доход' : 'Расход'}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                      </TableRow>
                    ))}
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
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={importing}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={parsedData.length === 0 || importing}
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
