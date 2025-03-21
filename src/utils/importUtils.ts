
import { Transaction, getTransactionCategories } from '@/types/transaction';

/**
 * Парсит CSV-файл и возвращает массив транзакций
 */
export const parseCSV = (csvContent: string): Partial<Transaction>[] => {
  // Разбиваем содержимое файла на строки
  const lines = csvContent.split('\n');
  if (lines.length < 2) {
    throw new Error('CSV файл не содержит данных или неверного формата');
  }
  
  // Получаем заголовки из первой строки
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  
  // Если заголовки не содержат минимально необходимые поля
  const requiredFields = ['amount', 'description', 'type'];
  const missingFields = requiredFields.filter(field => !headers.includes(field));
  
  if (missingFields.length > 0) {
    throw new Error(`CSV файл не содержит обязательные поля: ${missingFields.join(', ')}`);
  }
  
  const transactions: Partial<Transaction>[] = [];
  
  // Парсим строки, начиная со второй (индекс 1)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length !== headers.length) {
      console.warn(`Строка ${i+1} содержит неверное количество значений, пропускаем`);
      continue;
    }
    
    const transaction: Record<string, any> = {};
    
    // Заполняем объект транзакции значениями из строки
    headers.forEach((header, index) => {
      const value = values[index]?.trim() ?? '';
      
      switch (header) {
        case 'amount':
          transaction[header] = parseFloat(value);
          break;
        case 'date':
          try {
            transaction[header] = value ? new Date(value) : new Date();
          } catch (e) {
            transaction[header] = new Date();
          }
          break;
        case 'isreimbursement':
        case 'is_reimbursement':
          transaction['isReimbursement'] = value.toLowerCase() === 'true' || value === '1';
          break;
        case 'reimbursedto':
        case 'reimbursed_to':
          transaction['reimbursedTo'] = value;
          break;
        default:
          transaction[header] = value;
          break;
      }
    });
    
    // Преобразуем к типу Partial<Transaction>
    const typedTransaction: Partial<Transaction> = {
      amount: typeof transaction.amount === 'number' ? transaction.amount : 0,
      description: transaction.description || '',
      category: transaction.category || '',
      date: transaction.date instanceof Date ? transaction.date : new Date(),
      type: transaction.type as Transaction['type'],
      isReimbursement: Boolean(transaction.isReimbursement),
      reimbursedTo: transaction.reimbursedTo,
      company: transaction.company,
      project: transaction.project,
    };
    
    transactions.push(typedTransaction);
  }
  
  return transactions;
};

/**
 * Правильно разбивает строку CSV с учетом кавычек
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Парсит XML-файл и возвращает массив транзакций
 */
export const parseXML = (xmlContent: string): Partial<Transaction>[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  const transactions: Partial<Transaction>[] = [];
  
  // Проверяем на ошибки парсинга
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Неверный формат XML');
  }
  
  const transactionElements = xmlDoc.getElementsByTagName('transaction');
  
  if (transactionElements.length === 0) {
    throw new Error('XML файл не содержит транзакций');
  }
  
  for (let i = 0; i < transactionElements.length; i++) {
    const transactionEl = transactionElements[i];
    
    const getValue = (tagName: string) => {
      const element = transactionEl.getElementsByTagName(tagName)[0];
      return element ? element.textContent || '' : '';
    };
    
    const amountStr = getValue('amount');
    const dateStr = getValue('date');
    
    const transaction: Partial<Transaction> = {
      amount: amountStr ? parseFloat(amountStr) : 0,
      description: getValue('description'),
      category: getValue('category'),
      date: dateStr ? new Date(dateStr) : new Date(),
      type: getValue('type') as Transaction['type'],
      isReimbursement: getValue('isReimbursement') === 'true',
      reimbursedTo: getValue('reimbursedTo') || undefined,
      company: getValue('company') || undefined,
      project: getValue('project') || undefined,
    };
    
    transactions.push(transaction);
  }
  
  return transactions;
};

/**
 * Автоматическая категоризация транзакций на основе текстового описания
 */
export const categorizeTransactions = (transactions: Partial<Transaction>[]): Partial<Transaction>[] => {
  // Получаем все категории из системы
  const allCategories = getTransactionCategories();
  
  // Ключевые слова для автоматической категоризации
  const categoryKeywords: Record<string, Record<string, string[]>> = {
    income: {
      'Продажи': ['продажа', 'продажи', 'выручка', 'sale', 'revenue'],
      'Инвестиции': ['инвестиция', 'дивиденд', 'вклад', 'акция', 'investment', 'dividend'],
      'Возврат средств': ['возврат', 'вернуть', 'refund', 'return'],
      'Кредиты': ['кредит', 'заем', 'займ', 'loan', 'credit'],
    },
    expense: {
      'Аренда': ['аренда', 'офис', 'rent', 'office'],
      'Зарплаты': ['зарплата', 'оклад', 'сотрудник', 'salary', 'employee'],
      'Оборудование': ['оборудование', 'техника', 'компьютер', 'equipment', 'hardware'],
      'Маркетинг': ['маркетинг', 'реклама', 'продвижение', 'marketing', 'advertising'],
      'Коммунальные услуги': ['коммунальные', 'электричество', 'вода', 'utility', 'electricity'],
      'Налоги': ['налог', 'НДС', 'НДФЛ', 'tax', 'VAT'],
    },
    reimbursement: {
      'Транспорт': ['транспорт', 'такси', 'проезд', 'transport', 'taxi'],
      'Командировки': ['командировка', 'поездка', 'business trip', 'travel'],
      'Оборудование': ['оборудование', 'техника', 'компьютер', 'equipment', 'hardware'],
      'Канцелярия': ['канцелярия', 'бумага', 'ручка', 'stationery', 'paper'],
      'Клиентские встречи': ['клиент', 'встреча', 'client', 'meeting'],
    }
  };
  
  return transactions.map(transaction => {
    // Если категория уже есть, оставляем её
    if (transaction.category) {
      return transaction;
    }
    
    const description = transaction.description?.toLowerCase() || '';
    let type = transaction.type || 'expense';
    
    // Подбираем категорию на основе ключевых слов в описании
    let category = '';
    
    // Если это операция возмещения
    if (transaction.isReimbursement) {
      type = 'reimbursement';
    }
    
    // Проходимся по ключевым словам для данного типа транзакции
    const categoryType = type === 'reimbursement' ? 'reimbursement' : type;
    const categoriesForType = categoryKeywords[categoryType] || {};
    
    for (const [cat, keywords] of Object.entries(categoriesForType)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    // Если категория не найдена по ключевым словам, используем "Другое"
    if (!category) {
      const availableCategories = allCategories[type === 'reimbursement' ? 'reimbursement' : type];
      category = availableCategories.find(cat => cat.includes('Друг')) || availableCategories[0] || 'Другое';
    }
    
    return {
      ...transaction,
      category,
      type: type as Transaction['type']
    };
  });
};
