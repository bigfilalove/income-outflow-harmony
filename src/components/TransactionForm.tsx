
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Transaction, TransactionType, transactionCategories } from '@/types/transaction';
import { useTransactions } from '@/context/transaction';
import TransactionTypeTabs from '@/components/transaction/TransactionTypeTabs';
import TransactionDatePicker from '@/components/transaction/TransactionDatePicker';
import ReimbursementFields from '@/components/transaction/ReimbursementFields';
import CreatorField from '@/components/transaction/CreatorField';
import CategorySelect from '@/components/transaction/CategorySelect';
import CompanySelect from '@/components/transaction/CompanySelect';
import ProjectSelect from '@/components/transaction/ProjectSelect';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

const TransactionForm: React.FC = () => {
  const { addTransaction } = useTransactions();
  const [transactionType, setTransactionType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [reimbursedTo, setReimbursedTo] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setIsReimbursement(false); // Reset reimbursement when changing type
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }

    setIsSubmitting(true);

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      category,
      date,
      type: transactionType,
      createdBy: createdBy.trim() || undefined,
      company: company || undefined,
      project: project || undefined,
    };

    // Add reimbursement fields if it's a reimbursement
    if (transactionType === 'expense' && isReimbursement) {
      transaction.isReimbursement = true;
      transaction.reimbursedTo = reimbursedTo;
      transaction.reimbursementStatus = 'pending';
    }

    try {
      await addTransaction(transaction);
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setIsReimbursement(false);
      setReimbursedTo('');
      setCreatedBy('');
      setCompany('');
      setProject('');
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <TransactionTypeTabs 
            value={transactionType}
            onChange={handleTransactionTypeChange}
          />
          
          <div className="space-y-4">
            <CreatorField 
              value={createdBy}
              onChange={setCreatedBy}
            />

            <CompanySelect
              value={company}
              onChange={setCompany}
            />

            <ProjectSelect
              value={project}
              onChange={setProject}
            />

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
            
            <CategorySelect 
              categories={categories}
              value={category}
              onChange={setCategory}
            />
            
            {transactionType === 'expense' && (
              <ReimbursementFields 
                isReimbursement={isReimbursement}
                onReimbursementChange={setIsReimbursement}
                reimbursedTo={reimbursedTo}
                onReimbursedToChange={setReimbursedTo}
              />
            )}
            
            <TransactionDatePicker 
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            variant={transactionType === 'income' ? 'default' : 'outline'}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              transactionType === 'reimbursement' 
                ? 'Добавить возмещение' 
                : transactionType === 'income' 
                  ? 'Добавить доход' 
                  : 'Добавить расход'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
