// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
});

module.exports = mongoose.model('Employee', employeeSchema);