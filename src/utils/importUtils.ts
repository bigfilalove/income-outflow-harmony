// utils/importUtils.ts
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
            transaction.date = value ? new Date(parseDate(value)) : new Date();
          } catch (e) {
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
    { pattern: /(\d{2})\.(\d{2})\.(\d{4})/, transform: (d: string, m: string, y: string) => new Date(`${y}-${m}-${d}`) },
    { pattern: /(\d{4})-(\d{2})-(\d{2})/, transform: (y: string, m: string, d: string) => new Date(`${y}-${m}-${d}`) },
  ];

  for (const format of formats) {
    const match = dateStr.match(format.pattern);
    if (match) {
      return format.transform(match[3], match[2], match[1]);
    }
  }
  return new Date();
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
    },
  };

  const categorized: Partial<Transaction>[] = [];
  const skipped: string[] = [];

  for (const [index, transaction] of transactions.entries()) {
    // Проверяем наличие обязательных полей
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
    let type = transaction.type || 'expense';

    // Подбираем категорию на основе ключевых слов в описании
    let category = transaction.category || '';

    // Если это операция возмещения
    if (transaction.isReimbursement) {
      type = 'reimbursement';
    }

    // Проходимся по ключевым словам для данного типа транзакции
    if (!category) {
      const categoryType = type === 'reimbursement' ? 'reimbursement' : type;
      const categoriesForType = categoryKeywords[categoryType] || {};

      for (const [cat, keywords] of Object.entries(categoriesForType)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          category = cat;
          break;
        }
      }
    }

    // Если категория не найдена по ключевым словам или найдена, но мы хотим уточнить
    const categoryType = type === 'reimbursement' ? 'reimbursement' : type;
    const statsForType = categoriesStats[categoryType] || [];
    const availableCategories = allCategories[categoryType] || [];

    if (statsForType.length > 0) {
      // Находим наиболее популярную категорию из базы
      const mostPopularCategory = statsForType[0].category;

      // Если категория не определена или не входит в список доступных, используем самую популярную
      if (!category || !availableCategories.includes(category)) {
        category = mostPopularCategory;
      }
    }

    // Если категория всё ещё не определена, используем "Другое"
    if (!category) {
      category = availableCategories.find(cat => cat.includes('Друг')) || availableCategories[0] || 'Другое';
    }

    categorized.push({
      ...transaction,
      category,
      type: type as Transaction['type'],
    });
  }

  if (categorized.length === 0) {
    throw new Error(`CSV файл не содержит валидных транзакций для категоризации. Причины: ${skipped.join('; ')}`);
  }

  return categorized;
};