
// Импорты и настройки
const express = require('express');
const mongoose = require('mongoose');
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

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
require('./config/db');

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;
