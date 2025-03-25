// routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find().select('fullName');
    res.json(employees.map(employee => ({
      id: employee._id,
      fullName: employee.fullName,
    })));
  } catch (error) {
    next(error);
  }
});

module.exports = router;