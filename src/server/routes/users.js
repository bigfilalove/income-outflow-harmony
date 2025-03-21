
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all user routes
router.use(authenticate);

// Get all users (admin only)
router.get('/', async (req, res, next) => {
  try {
    // Only admin can access users list
    if (req.user.role !== 'admin') {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    // Users can only access their own data unless they're an admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
