
import { z } from 'zod';
import { Budget, BudgetPeriod } from '@/types/budget';

export const formSchema = z.object({
  category: z.string({ required_error: 'Выберите категорию' }),
  amount: z.coerce.number({ required_error: 'Введите сумму' }).positive('Сумма должна быть положительной'),
  period: z.enum(['monthly', 'quarterly', 'annual'], { required_error: 'Выберите период' }),
  year: z.coerce.number({ required_error: 'Выберите год' }),
  month: z.coerce.number({ required_error: 'Выберите месяц/квартал' }),
  type: z.enum(['expense', 'income'], { required_error: 'Выберите тип' }),
  company: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface BudgetFormProps {
  onSuccess?: () => void;
  initialData?: Budget;
  defaultType?: 'expense' | 'income';
}
