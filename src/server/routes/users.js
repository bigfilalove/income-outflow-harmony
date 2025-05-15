
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

// Create a new user (admin only)
router.post('/', async (req, res, next) => {
  try {
    // Only admin can create users
    if (req.user.role !== 'admin') {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    
    const { name, email, username, password, role } = req.body;
    
    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      const error = new Error('User with this email or username already exists');
      error.statusCode = 409;
      throw error;
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password, // Will be hashed by the pre-save hook
      role: role || 'basic'
    });
    
    await newUser.save();
    
    // Don't send the password back
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res, next) => {
  try {
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
