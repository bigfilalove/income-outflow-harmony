const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Company = require('../models/Company');

// GET /api/companies - Получить список всех компаний
router.get('/', authMiddleware, async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/companies - Добавить новую компанию
router.post('/', authMiddleware, async (req, res) => {
  try {
    const companyData = req.body;
    const company = new Company(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: 'Invalid company data' });
  }
});

// PUT /api/companies/:id - Обновить компанию
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;