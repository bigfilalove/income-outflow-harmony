const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Company = require('../models/Company');

// GET /api/companies - Получить список всех компаний
router.get('/', authenticate, async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/companies - Добавить новую компанию
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(409).json({ message: 'Company already exists' });
    }

    const company = new Company({ name });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: 'Invalid company data' });
  }
});

// PUT /api/companies/:id - Обновить компанию
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const company = await Company.findByIdAndUpdate(id, { name }, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: 'Invalid company data' });
  }
});

// DELETE /api/companies/:id - Удалить компанию
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ success: true }); // Изменяем для совместимости с клиентом
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;