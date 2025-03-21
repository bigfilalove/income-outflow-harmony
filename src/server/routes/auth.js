
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';

// Login endpoint
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.findOne({ username });
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    // Check password using the comparePassword method
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    // Create token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        role: user.role,
        name: user.name
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Register endpoint
router.post('/register', async (req, res, next) => {
  const { name, email, username, password, role = 'basic' } = req.body;
  
  try {
    if (!name || !email || !username || !password) {
      const error = new Error('All fields are required');
      error.statusCode = 400;
      throw error;
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }
    
    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      name,
      email,
      username,
      password,
      role
    });
    
    // Create token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        username: newUser.username,
        role: newUser.role,
        name: newUser.name
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
