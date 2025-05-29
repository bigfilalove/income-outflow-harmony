
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Применяем middleware аутентификации
router.use(authenticate);

// Получить все компании
router.get('/', async (req, res, next) => {
  try {
    // Возвращаем предопределенные компании
    const companies = [
      { id: '1', name: 'Основная компания' },
      { id: '2', name: 'Филиал 1' },
      { id: '3', name: 'Филиал 2' }
    ];
    
    res.json(companies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
