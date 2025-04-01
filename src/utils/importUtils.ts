
// utils/importUtils.ts
import { Transaction, getTransactionCategories, CategoryList, CategoryType } from '@/types/transaction';

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
  const headers = lines[0].split(';').map(header => header.trim().toLowerCase());

  // Проверяем наличие обязательных заголовков
  const requiredHeaders = [
    'сумма в валюте счета',
    'назначение платежа',
    'тип операции (пополнение/списание)',
  ];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(`CSV файл не содержит обязательные заголовки: ${missingHeaders.join(', ')}`);
  }

  const transactions: Partial<Transaction>[] = [];
  const skippedRows: string[] = [];

  // Парсим строки, начиная со второй (индекс 1)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line, ';');
    if (values.length !== headers.length) {
      skippedRows.push(`Строка ${i + 1} пропущена: содержит неверное количество значений`);
      continue;
    }

    const transaction: Partial<Transaction> = {};

    // Заполняем объект транзакции значениями из строки
    headers.forEach((header, index) => {
      const value = values[index]?.trim() ?? '';

      switch (header) {
        case 'сумма в валюте счета':
          const amount = parseFloat(value.replace(',', '.'));
          if (isNaN(amount)) {
            skippedRows.push(`Транзакция в строке ${i + 1} пропущена: некорректная сумма "${value}"`);
            return;
          }
          transaction.amount = amount;
          break;
        case 'назначение платежа':
          if (!value) {
            skippedRows.push(`Транзакция в строке ${i + 1} пропущена: отсутствует описание`);
            return;
          }
          transaction.description = value;
          break;
        case 'тип операции (пополнение/списание)':
          const typeMap: { [key: string]: string } = {
            'credit': 'income',
            'debit': 'expense',
            'пополнение': 'income',
            'списание': 'expense',
            'income': 'income',
            'expense': 'expense',
          };
          const normalizedValue = value.toLowerCase();
          if (!value || !typeMap[normalizedValue]) {
            skippedRows.push(`Транзакция в строке ${i + 1} пропущена: некорректный тип операции "${value}"`);
            return;
          }
          transaction.type = typeMap[normalizedValue] as Transaction['type'];
          break;
        case 'категория операции':
          transaction.category = value || '';
          break;
          case 'дата транзакции':
            try {
              const parsedDate = value ? parseDate(value) : new Date();
              console.log(`Дата из CSV: ${value}, распарсенная дата: ${parsedDate}`);
              transaction.date = parsedDate;
            } catch (e) {
              skippedRows.push(`Транзакция в строке ${i + 1} пропущена: некорректная дата "${value}"`);
              transaction.date = new Date();
            }
            break;
        case 'контрагент':
          transaction.reimbursedTo = value;
          break;
        case 'наименование банка контрагента':
          transaction.company = value;
          break;
        case 'валюта операции':
          if (value && value !== 'RUB' && value !== '643') {
            skippedRows.push(`Транзакция в строке ${i + 1} пропущена: валюта ${value} не поддерживается`);
            return;
          }
          break;
      }
    });

    // Проверяем, что обязательные поля заполнены
    if (!transaction.amount) {
      skippedRows.push(`Транзакция в строке ${i + 1} пропущена: отсутствует сумма`);
      continue;
    }
    if (!transaction.description) {
      skippedRows.push(`Транзакция в строке ${i + 1} пропущена: отсутствует описание`);
      continue;
    }
    if (!transaction.type) {
      skippedRows.push(`Транзакция в строке ${i + 1} пропущена: отсутствует тип`);
      continue;
    }

    // Устанавливаем значения по умолчанию для необязательных полей
    transaction.category = transaction.category || '';
    transaction.date = transaction.date || new Date();
    transaction.isReimbursement = transaction.isReimbursement ?? false;
    transaction.reimbursedTo = transaction.reimbursedTo || undefined;
    transaction.company = transaction.company || undefined;
    transaction.project = transaction.project || undefined;

    transactions.push(transaction);
  }

  if (transactions.length === 0) {
    throw new Error(`CSV файл не содержит валидных транзакций для импорта. Причины: ${skippedRows.join('; ')}`);
  }

  return transactions;
};

/**
 * Правильно разбивает строку CSV с учетом разделителя
 */
const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
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
 * Парсит дату в формате ДД.ММ.ГГГГ или ГГГГ-ММ-ДД
 */

const parseDate = (dateStr: string): Date => {
  const formats = [
    // DD.MM.YYYY
    {
      pattern: /(\d{2})\.(\d{2})\.(\d{4})/,
      transform: (d: string, m: string, y: string) => {
        const day = parseInt(d, 10);
        const month = parseInt(m, 10) - 1; // Месяц в JS начинается с 0
        const year = parseInt(y, 10);
        return new Date(Date.UTC(year, month, day));
      },
    },
    // DD.MM.YY
    {
      pattern: /(\d{2})\.(\d{2})\.(\d{2})/,
      transform: (d: string, m: string, y: string) => {
        const day = parseInt(d, 10);
        const month = parseInt(m, 10) - 1; // Месяц в JS начинается с 0
        let year = parseInt(y, 10);
        // Если год двухзначный, предполагаем, что это 20XX
        year = year < 50 ? 2000 + year : 1900 + year;
        return new Date(Date.UTC(year, month, day));
      },
    },
    // YYYY-MM-DD
    {
      pattern: /(\d{4})-(\d{2})-(\d{2})/,
      transform: (y: string, m: string, d: string) => {
        const year = parseInt(y, 10);
        const month = parseInt(m, 10) - 1; // Месяц в JS начинается с 0
        const day = parseInt(d, 10);
        return new Date(Date.UTC(year, month, day));
      },
    },
  ];

  for (const format of formats) {
    const match = dateStr.match(format.pattern);
    if (match) {
      // Для DD.MM.YYYY и DD.MM.YY: match[1] — день, match[2] — месяц, match[3] — год
      // Для YYYY-MM-DD: match[1] — год, match[2] — месяц, match[3] — день
      let date: Date;
      if (format.pattern === formats[0].pattern || format.pattern === formats[1].pattern) {
        // DD.MM.YYYY или DD.MM.YY
        date = format.transform(match[1], match[2], match[3]); // день, месяц, год
      } else {
        // YYYY-MM-DD
        date = format.transform(match[1], match[2], match[3]); // год, месяц, день
      }
      if (isNaN(date.getTime())) {
        throw new Error(`Некорректная дата: ${dateStr}`);
      }
      return date;
    }
  }
  throw new Error(`Неподдерживаемый формат даты: ${dateStr}`);
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
 * Автоматическая категоризация транзакций на основе текстового описания и статистики из базы
 */
export const categorizeTransactions = (
  transactions: Partial<Transaction>[],
  categoriesStats: Record<string, { category: string; count: number }[]>
): Partial<Transaction>[] => {
  const allCategories = getTransactionCategories();
  console.log('Все категории из getTransactionCategories:', allCategories);

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
    },
  };

  const categorized: Partial<Transaction>[] = [];
  const skipped: string[] = [];

  for (const [index, transaction] of transactions.entries()) {
    if (!transaction.amount) {
      skipped.push(`Транзакция ${index + 1} пропущена: отсутствует сумма`);
      continue;
    }
    if (!transaction.description) {
      skipped.push(`Транзакция ${index + 1} пропущена: отсутствует описание`);
      continue;
    }
    if (!transaction.type) {
      skipped.push(`Транзакция ${index + 1} пропущена: отсутствует тип`);
      continue;
    }

    const description = transaction.description?.toLowerCase() || '';
    let type = transaction.type;
    let category = transaction.category || '';

    console.log(`Транзакция ${index + 1}, описание: "${description}", тип: ${type}, начальная категория: "${category}"`);

    // Map the type
    let categoryType: CategoryType = type;
    if (transaction.isReimbursement) {
      categoryType = 'reimbursement';
    }

    if (!category) {
      const categoriesForType = categoryKeywords[categoryType] || {};

      for (const [cat, keywords] of Object.entries(categoriesForType)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          category = cat;
          console.log(`Назначена категория "${cat}" для транзакции "${description}" на основе ключевых слов: ${keywords}`);
          break;
        }
      }
    }

    const statsForType = categoriesStats[categoryType] || [];
    const availableCategories = allCategories[categoryType as keyof CategoryList] || [];

    console.log(`Тип категории: ${categoryType}, статистика:`, statsForType, `доступные категории:`, availableCategories);

    if (statsForType.length > 0) {
      const mostPopularCategory = statsForType[0].category;
      if (!category || !availableCategories.includes(category)) {
        category = mostPopularCategory;
        console.log(`Категория перезаписана на популярную: "${mostPopularCategory}"`);
      }
    }

    if (!category) {
      category = availableCategories.find(cat => cat.includes('Друг')) || availableCategories[0] || 'Другое';
      console.log(`Категория установлена по умолчанию: "${category}"`);
    }

    categorized.push({
      ...transaction,
      category,
      type,
    });

    console.log(`Транзакция ${index + 1}, итоговая категория: "${category}"`);
  }

  if (categorized.length === 0) {
    throw new Error(`CSV файл не содержит валидных транзакций для категоризации. Причины: ${skipped.join('; ')}`);
  }

  return categorized;
};
