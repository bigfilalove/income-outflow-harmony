
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { authenticate } = require('../middleware/auth');

// Применяем middleware аутентификации
router.use(authenticate);

// Получить все бюджеты
router.get('/', async (req, res, next) => {
  try {
    const { period, year, month, type, company } = req.query;
    
    const query = {};
    if (period) query.period = period;
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (type) query.type = type;
    if (company) query.company = company;
    
    const budgets = await Budget.find(query).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
});

// Создать новый бюджет
router.post('/', async (req, res, next) => {
  try {
    // Проверяем, существует ли уже такой бюджет
    const { category, period, year, month, type, company } = req.body;
    
    const existingBudget = await Budget.findOne({
      category, period, year, month, type, 
      company: company || null
    });
    
    if (existingBudget) {
      // Обновляем существующий бюджет
      existingBudget.amount = req.body.amount;
      await existingBudget.save();
      return res.json(existingBudget);
    }
    
    // Создаем новый бюджет
    const budget = await Budget.create(req.body);
    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
});

// Обновить бюджет
router.put('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      const error = new Error('Бюджет не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(budget);
  } catch (error) {
    next(error);
  }
});

// Удалить бюджет
router.delete('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    
    if (!budget) {
      const error = new Error('Бюджет не найден');
      error.statusCode = 404;
      throw error;
    }
    
    res.json({ message: 'Бюджет удален' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
