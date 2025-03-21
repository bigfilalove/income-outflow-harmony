
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

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

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await Transaction.deleteMany({});
    await User.deleteMany({});
    
    // Insert new data
    await Transaction.insertMany(transactions);
    await User.insertMany(users);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
