
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

// Import route handlers
const transactionCRUD = require('./transaction-crud');
const transactionImport = require('./transaction-import');
const transactionStatus = require('./transaction-status');
const cashFlow = require('./cash-flow');
const categoryStats = require('./category-stats');
const projectAllocations = require('./project-allocations');

// Apply authentication middleware to all transaction routes
router.use(authenticate);

// Basic CRUD operations
router.get('/', transactionCRUD.getAllTransactions);
router.post('/', transactionCRUD.createTransaction);
router.put('/:id', transactionCRUD.updateTransaction);
router.delete('/:id', transactionCRUD.deleteTransaction);

// Bulk import
router.post('/import', transactionImport.importTransactions);

// Status updates
router.patch('/:id/status', transactionStatus.updateTransactionStatus);

// Analytics and reports
router.get('/cash-flow', cashFlow.getCompanyCashFlow);
router.get('/categories-stats', categoryStats.getCategoriesStats);

// Project allocations routes
router.get('/project-allocations', projectAllocations.getProjectAllocations);
router.get('/project-allocations/summary', projectAllocations.getProjectAllocationsSummary);

module.exports = router;
