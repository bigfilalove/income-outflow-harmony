const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

// Данные пользователей
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
  },
  {
    name: "Вячеслав",
    email: "v.eremkin.work@gmail.com",
    username: "eremkin",
    password: "123456",
    role: "user",
    createdAt: new Date("2025-03-21T04:50:19.553Z")
  }
];

// Данные транзакций
const transactions = [
  {
    amount: 100000,
    description: "Предоплата по сделке Благодатная",
    category: "Продажи",
    date: new Date("2025-02-13T17:00:00.000Z"),
    type: "income",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Станислав Вдовин",
    company: "ИП Вдовин",
    createdAt: new Date("2025-02-13T17:00:00.000Z")
  },
  {
    amount: 58152,
    description: "Вторая часть оплаты по сделке Благодатная",
    category: "Продажи",
    date: new Date("2025-02-20T17:00:00.000Z"),
    type: "income",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Станислав Вдовин",
    company: "ИП Вдовин",
    createdAt: new Date("2025-02-20T17:00:00.000Z")
  },
  {
    amount: 2487,
    description: "Оплата Битрикс",
    category: "Другое",
    date: new Date("2025-02-15T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-02-15T17:00:00.000Z")
  },
  {
    amount: 13990,
    description: "Оплата Битрикс",
    category: "Другое",
    date: new Date("2025-03-05T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-03-05T17:00:00.000Z")
  },
  {
    amount: 24000,
    description: "Пополнение Яндекс.Директ",
    category: "Маркетинг",
    date: new Date("2024-12-26T17:00:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Станислав Вдовин",
    company: "Наличные",
    createdAt: new Date("2024-12-26T17:00:00.000Z")
  },
  {
    amount: 15000,
    description: "Пополнение Яндекс.Директ",
    category: "Маркетинг",
    date: new Date("2025-02-06T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-02-06T17:00:00.000Z")
  },
  {
    amount: 6000,
    description: "Пополнение Яндекс.Директ",
    category: "Маркетинг",
    date: new Date("2025-03-18T17:00:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: null,
    company: "Наличные",
    createdAt: new Date("2025-03-18T17:00:00.000Z")
  },
  {
    amount: 5000,
    description: "Пополнение Яндекс.Директ",
    category: "Маркетинг",
    date: new Date("2025-03-18T17:00:00.000Z"),
    type: "expense",
    isReimbursement: false,
    reimbursedTo: null,
    reimbursementStatus: null,
    createdBy: "Станислав Вдовин",
    company: "Наличные",
    createdAt: new Date("2025-03-18T17:00:00.000Z")
  },
  {
    amount: 750,
    description: "Оплата Tilda",
    category: "Маркетинг",
    date: new Date("2025-02-02T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-02-02T17:00:00.000Z")
  },
  {
    amount: 750,
    description: "Оплата Tilda",
    category: "Маркетинг",
    date: new Date("2025-03-02T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-03-02T17:00:00.000Z")
  },
  {
    amount: 1190,
    description: "Оплата Marquiz",
    category: "Маркетинг",
    date: new Date("2025-01-21T17:00:00.000Z"),
    type: "expense",
    isReimbursement: true,
    reimbursedTo: "Вячеслав Еремкин",
    reimbursementStatus: "pending",
    createdBy: "Вячеслав Еремкин",
    company: "Наличные",
    createdAt: new Date("2025-01-21T17:00:00.000Z")
  }
];

const seedDatabase = async () => {
  try {
    // Подключение к MongoDB
    await connectDB();
    
    // Очистка существующих данных
    await Transaction.deleteMany({});
    await User.deleteMany({});
    
    // Хешируем пароли перед сохранением
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }));
    
    // Сохраняем пользователей
    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');

    // Сохраняем транзакции
    await Transaction.insertMany(transactions);
    console.log('Transactions seeded successfully');
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();