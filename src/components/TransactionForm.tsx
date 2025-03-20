
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction, TransactionType, transactionCategories } from '@/types/transaction';
import { useTransactions } from '@/context/TransactionContext';

const TransactionForm: React.FC = () => {
  const { addTransaction } = useTransactions();
  const [transactionType, setTransactionType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      category,
      date,
      type: transactionType,
    };

    // Add reimbursement fields if it's a reimbursement
    if (transactionType === 'expense' && isReimbursement) {
      transaction.isReimbursement = true;
      transaction.reimbursedTo = reimbursedTo;
      transaction.reimbursementStatus = 'pending';
    }

    addTransaction(transaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date());
    setIsReimbursement(false);
    setReimbursedTo('');
  };

  const categories = transactionCategories[transactionType];

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <CardTitle>Новая транзакция</CardTitle>
        <CardDescription>Добавьте доход или расход</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs 
            defaultValue="income" 
            onValueChange={(value) => {
              setTransactionType(value as TransactionType);
              setIsReimbursement(false); // Reset reimbursement when changing type
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income">Приход</TabsTrigger>
              <TabsTrigger value="expense">Расход</TabsTrigger>
              <TabsTrigger value="reimbursement">Возмещение</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Описание транзакции"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {transactionType === 'expense' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reimbursement" 
                  checked={isReimbursement}
                  onCheckedChange={(checked: boolean) => setIsReimbursement(checked)}
                />
                <Label htmlFor="reimbursement" className="cursor-pointer">
                  Расход из личных средств (требуется возмещение)
                </Label>
              </div>
            )}

            {isReimbursement && (
              <div className="space-y-2">
                <Label htmlFor="reimbursedTo">Кому возместить</Label>
                <Input
                  id="reimbursedTo"
                  placeholder="Имя сотрудника"
                  value={reimbursedTo}
                  onChange={(e) => setReimbursedTo(e.target.value)}
                  required={isReimbursement}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Выберите дату</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            variant={transactionType === 'income' ? 'default' : 'outline'}
          >
            {transactionType === 'reimbursement' 
              ? 'Добавить возмещение' 
              : transactionType === 'income' 
                ? 'Добавить доход' 
                : 'Добавить расход'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
