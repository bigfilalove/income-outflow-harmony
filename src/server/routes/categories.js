
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Применяем middleware аутентификации
router.use(authenticate);

// Получить все категории
router.get('/', async (req, res, next) => {
  try {
    // Возвращаем предопределенные категории
    const categories = [
      { id: '1', name: 'Продажи', type: 'income' },
      { id: '2', name: 'Инвестиции', type: 'income' },
      { id: '3', name: 'Прочие доходы', type: 'income' },
      { id: '4', name: 'Зарплата', type: 'expense' },
      { id: '5', name: 'Аренда', type: 'expense' },
      { id: '6', name: 'Коммунальные услуги', type: 'expense' },
      { id: '7', name: 'Реклама и маркетинг', type: 'expense' },
      { id: '8', name: 'Канцелярские товары', type: 'expense' },
      { id: '9', name: 'Транспорт', type: 'expense' },
      { id: '10', name: 'Питание', type: 'expense' },
      { id: '11', name: 'Прочие расходы', type: 'expense' }
    ];
    
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
