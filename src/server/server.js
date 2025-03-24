// Импорты и настройки
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Подключение middleware
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Подключение маршрутов
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const predictionsRoutes = require('./routes/predictions');
const usersRoutes = require('./routes/users');
const budgetsRoutes = require('./routes/budgets');
const companiesRoutes = require('./routes/companies');
const categoriesRoutes = require('./routes/categories'); // Добавляем маршрут для категорий

// Подключение к MongoDB
const connectDB = require('./config/db');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/categories', categoriesRoutes); // Подключаем маршрут

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Статические файлы для production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
  });
}

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Запуск сервера после подключения к MongoDB
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;