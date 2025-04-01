
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactions } from '@/context/transaction';
import TransactionDatePicker from './TransactionDatePicker';
import CreatorField from './CreatorField';
import { useEmployees } from '@/context/employee';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransferForm: React.FC = () => {
  const { addTransaction } = useTransactions();
  const { employees, fetchEmployees } = useEmployees();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [createdBy, setCreatedBy] = useState('');
  const [fromCompany, setFromCompany] = useState('');
  const [toCompany, setToCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch available companies
  const [companies, setCompanies] = useState<string[]>([]);
  
  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('finance-tracker-token');
        const response = await fetch('http://localhost:5050/api/companies', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const companyNames = data.map((company: any) => company.name);
        setCompanies(companyNames);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Не удалось загрузить список компаний');
      }
    };
    
    fetchCompanies();
    fetchEmployees();
  }, [fetchEmployees]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !fromCompany || !toCompany) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля"
      });
      return;
    }
    
    if (fromCompany === toCompany) {
      toast("Ошибка", {
        description: "Компании отправления и получения должны быть разными"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the transfer transaction
      await addTransaction({
        amount: parseFloat(amount),
        description,
        category: "Перевод между компаниями",
        date,
        type: 'transfer',
        isTransfer: true,
        fromCompany,
        toCompany,
        createdBy: createdBy.trim() || undefined,
        createdAt: new Date(),
      });
      
      // Reset form after successful submission
      setAmount('');
      setDescription('');
      setFromCompany('');
      setToCompany('');
      
      toast("Перевод добавлен", {
        description: `Перевод на сумму ${amount} был успешно добавлен.`
      });
    } catch (error) {
      toast("Ошибка", {
        description: 'Не удалось добавить перевод между компаниями.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <CardTitle>Перевод между компаниями</CardTitle>
        <CardDescription>Добавьте перевод средств между компаниями</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <CreatorField
              value={createdBy}
              onChange={setCreatedBy}
            />
            
            <div className="space-y-2">
              <Label htmlFor="fromCompany">Компания отправитель</Label>
              <Select value={fromCompany} onValueChange={setFromCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите компанию отправителя" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toCompany">Компания получатель</Label>
              <Select value={toCompany} onValueChange={setToCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите компанию получателя" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                placeholder="Описание перевода"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <TransactionDatePicker
              date={date}
              onDateChange={(newDate) => newDate && setDate(newDate)}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавление...
              </>
            ) : (
              'Добавить перевод'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
