
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Применяем middleware аутентификации
router.use(authenticate);

// Получить все проекты
router.get('/', async (req, res, next) => {
  try {
    // Возвращаем предопределенные проекты
    const projects = [
      { id: '1', name: 'Проект А' },
      { id: '2', name: 'Проект Б' },
      { id: '3', name: 'Проект В' }
    ];
    
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
