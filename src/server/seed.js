
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Budget = require('./models/Budget');

// Sample data
const transactions = [
  {
    amount: 50000,
    description: "Продажа услуг",
    category: "Продажи",
    date: new Date("2023-07-15T10:30:00.000Z"),
    type: "income",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Иван Петров",
    createdAt: new Date("2023-07-15T10:30:00.000Z"),
    company: "ООО \"Технологии будущего\""
  },
  {
    amount: 15000,
    description: "Аренда офиса",
    category: "Аренда",
    date: new Date("2023-07-20T14:00:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Мария Сидорова",
    createdAt: new Date("2023-07-20T14:00:00.000Z"),
    company: "ЗАО \"Инновации\""
  },
  {
    amount: 5000,
    description: "Командировочные расходы",
    category: "Командировки",
    date: new Date("2023-07-25T09:15:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Алексей Иванов",
    reimbursementStatus: "pending",
    createdBy: "Мария Сидорова",
    createdAt: new Date("2023-07-25T09:15:00.000Z"),
    company: "ООО \"Строй-Мастер\""
  },
  // Добавляем больше транзакций за разные годы
  {
    amount: 75000,
    description: "Продажа товаров",
    category: "Продажи",
    date: new Date("2022-03-10T08:45:00.000Z"),
    type: "income",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Иван Петров",
    createdAt: new Date("2022-03-10T08:45:00.000Z"),
    company: "ООО \"Технологии будущего\""
  },
  {
    amount: 12000,
    description: "Оплата интернета",
    category: "Коммунальные услуги",
    date: new Date("2022-04-05T11:20:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Мария Сидорова",
    createdAt: new Date("2022-04-05T11:20:00.000Z"),
    company: "ЗАО \"Инновации\""
  },
  {
    amount: 100000,
    description: "Инвестиции в оборудование",
    category: "Оборудование",
    date: new Date("2021-09-15T13:00:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Алексей Иванов",
    createdAt: new Date("2021-09-15T13:00:00.000Z"),
    company: "ООО \"Строй-Мастер\""
  },
  {
    amount: 120000,
    description: "Крупный контракт",
    category: "Продажи",
    date: new Date("2021-11-20T15:30:00.000Z"),
    type: "income",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Иван Петров",
    createdAt: new Date("2021-11-20T15:30:00.000Z"),
    company: "ООО \"Технологии будущего\""
  }
];

const users = [
  {
    name: "Иван Петров",
    email: "ivan@example.com",
    username: "ivanp",
    password: "password123",
    role: "admin",
    createdAt: new Date("2023-01-15T10:00:00.000Z")
  },
  {
    name: "Мария Сидорова",
    email: "maria@example.com",
    username: "marias",
    password: "password456",
    role: "user",
    createdAt: new Date("2023-02-20T11:30:00.000Z")
  },
  {
    name: "Алексей Иванов",
    email: "alexey@example.com",
    username: "alexeyi",
    password: "password789",
    role: "basic",
    createdAt: new Date("2023-03-10T09:45:00.000Z")
  }
];

// Добавляем тестовые бюджеты за 2021-2023 годы
const generateBudgets = () => {
  const budgets = [];
  const years = [2021, 2022, 2023];
  const categories = {
    expense: ['Аренда', 'Зарплата', 'Коммунальные услуги', 'Маркетинг', 'Оборудование', 'Командировки', 'Обучение'],
    income: ['Продажи', 'Услуги консалтинга', 'Техническая поддержка', 'Обучение клиентов', 'Инвестиции']
  };
  const companies = ['ООО "Технологии будущего"', 'ЗАО "Инновации"', 'ООО "Строй-Мастер"', null]; // null для общих бюджетов

  // Ежемесячные бюджеты
  years.forEach(year => {
    for (let month = 1; month <= 12; month++) {
      // Расходы
      categories.expense.forEach(category => {
        // Базовая сумма с небольшими вариациями
        const baseAmount = getBaseAmount(category, 'expense');
        const monthFactor = getMonthFactor(month);
        const yearFactor = getYearFactor(year);
        const amount = Math.round(baseAmount * monthFactor * yearFactor);

        // Добавляем бюджет для разных компаний
        companies.forEach(company => {
          if (Math.random() > 0.5) { // Не для всех компаний создаем все бюджеты
            budgets.push({
              category,
              amount: company ? Math.round(amount * (0.3 + Math.random() * 0.5)) : amount,
              period: 'monthly',
              year,
              month,
              type: 'expense',
              createdBy: null,
              createdAt: new Date(),
              company
            });
          }
        });
      });

      // Доходы
      categories.income.forEach(category => {
        const baseAmount = getBaseAmount(category, 'income');
        const monthFactor = getMonthFactor(month);
        const yearFactor = getYearFactor(year);
        const amount = Math.round(baseAmount * monthFactor * yearFactor);

        // Добавляем бюджет для разных компаний
        companies.forEach(company => {
          if (Math.random() > 0.5) { // Не для всех компаний создаем все бюджеты
            budgets.push({
              category,
              amount: company ? Math.round(amount * (0.3 + Math.random() * 0.5)) : amount,
              period: 'monthly',
              year,
              month,
              type: 'income',
              createdBy: null,
              createdAt: new Date(),
              company
            });
          }
        });
      });
    }

    // Квартальные бюджеты
    for (let quarter = 1; quarter <= 4; quarter++) {
      // Расходы
      categories.expense.forEach(category => {
        if (Math.random() > 0.3) { // Не для всех категорий создаем квартальные бюджеты
          const baseAmount = getBaseAmount(category, 'expense') * 3;
          const quarterFactor = getQuarterFactor(quarter);
          const yearFactor = getYearFactor(year);
          const amount = Math.round(baseAmount * quarterFactor * yearFactor);

          budgets.push({
            category,
            amount,
            period: 'quarterly',
            year,
            month: quarter,
            type: 'expense',
            createdBy: null,
            createdAt: new Date(),
            company: null
          });
        }
      });

      // Доходы
      categories.income.forEach(category => {
        if (Math.random() > 0.3) { // Не для всех категорий создаем квартальные бюджеты
          const baseAmount = getBaseAmount(category, 'income') * 3;
          const quarterFactor = getQuarterFactor(quarter);
          const yearFactor = getYearFactor(year);
          const amount = Math.round(baseAmount * quarterFactor * yearFactor);

          budgets.push({
            category,
            amount,
            period: 'quarterly',
            year,
            month: quarter,
            type: 'income',
            createdBy: null,
            createdAt: new Date(),
            company: null
          });
        }
      });
    }

    // Годовые бюджеты
    categories.expense.forEach(category => {
      const baseAmount = getBaseAmount(category, 'expense') * 12;
      const yearFactor = getYearFactor(year);
      const amount = Math.round(baseAmount * yearFactor);

      budgets.push({
        category,
        amount,
        period: 'annual',
        year,
        month: 1,
        type: 'expense',
        createdBy: null,
        createdAt: new Date(),
        company: null
      });
    });

    categories.income.forEach(category => {
      const baseAmount = getBaseAmount(category, 'income') * 12;
      const yearFactor = getYearFactor(year);
      const amount = Math.round(baseAmount * yearFactor);

      budgets.push({
        category,
        amount,
        period: 'annual',
        year,
        month: 1,
        type: 'income',
        createdBy: null,
        createdAt: new Date(),
        company: null
      });
    });
  });

  return budgets;
};

// Вспомогательные функции для генерации реалистичных данных
function getBaseAmount(category, type) {
  // Базовые суммы по категориям
  const baseAmounts = {
    expense: {
      'Аренда': 20000,
      'Зарплата': 100000,
      'Коммунальные услуги': 5000,
      'Маркетинг': 15000,
      'Оборудование': 25000,
      'Командировки': 10000,
      'Обучение': 8000
    },
    income: {
      'Продажи': 150000,
      'Услуги консалтинга': 80000,
      'Техническая поддержка': 40000,
      'Обучение клиентов': 25000,
      'Инвестиции': 100000
    }
  };

  return baseAmounts[type][category] || 10000;
}

function getMonthFactor(month) {
  // Разные месяцы могут иметь разную сезонность
  const seasonality = {
    1: 0.8,  // Январь
    2: 0.85, // Февраль
    3: 0.9,  // Март
    4: 0.95, // Апрель
    5: 1.0,  // Май
    6: 1.05, // Июнь
    7: 0.9,  // Июль
    8: 0.85, // Август
    9: 1.1,  // Сентябрь
    10: 1.15, // Октябрь
    11: 1.2,  // Ноябрь
    12: 1.3   // Декабрь
  };

  return seasonality[month] || 1.0;
}

function getQuarterFactor(quarter) {
  // Разные кварталы имеют разную сезонность
  const quarterFactors = {
    1: 0.9, // Первый квартал
    2: 1.0, // Второй квартал
    3: 0.95, // Третий квартал
    4: 1.2  // Четвертый квартал
  };

  return quarterFactors[quarter] || 1.0;
}

function getYearFactor(year) {
  // Рост бюджетов по годам
  const yearFactors = {
    2021: 0.8,
    2022: 1.0,
    2023: 1.2
  };

  return yearFactors[year] || 1.0;
}

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await Transaction.deleteMany({});
    await User.deleteMany({});
    await Budget.deleteMany({});
    
    // Insert new data
    await Transaction.insertMany(transactions);
    await User.insertMany(users);
    
    // Generate and insert budgets
    const budgets = generateBudgets();
    await Budget.insertMany(budgets);
    
    console.log(`Database seeded successfully with ${transactions.length} transactions, ${users.length} users, and ${budgets.length} budgets`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
