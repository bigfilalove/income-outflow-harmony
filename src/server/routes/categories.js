
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Category = require('../models/Category');

// GET /api/categories - Получить список всех категорий с возможной фильтрацией по типу
router.get('/', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const categories = await Category.find(query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories - Добавить новую категорию
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    // Проверка на дубликат
    const existingCategory = await Category.findOne({ name, type });
    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    // Проверка валидности type
    if (!['income', 'expense', 'reimbursement', 'transfer'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const category = new Category({ name, type });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category data' });
  }
});

// PUT /api/categories/:id - Обновить категорию
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    // Проверка валидности type
    if (!['income', 'expense', 'reimbursement', 'transfer'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const category = await Category.findByIdAndUpdate(id, { name, type }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category data' });
  }
});

// DELETE /api/categories/:id - Удалить категорию
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ success: true }); // Изменяем для совместимости с клиентом
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
