const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Category = require('../models/Category');

// GET /api/categories - Получить список всех категорий с возможной фильтрацией по типу
router.get('/', authMiddleware, async (req, res) => {
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    const category = new Category({ name, type });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Invalid category data' });
  }
});

// DELETE /api/categories/:id - Удалить категорию
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;