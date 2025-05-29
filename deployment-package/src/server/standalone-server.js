
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance_tracker';

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('🔄 Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (if dist exists)
const distPath = path.join(__dirname, '../../dist');
try {
  app.use(express.static(distPath));
} catch (err) {
  console.log('📁 Static files directory not found, serving API only');
}

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/projects', require('./routes/projects'));

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.json(health);
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Finance Tracker API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      '/api/auth',
      '/api/transactions',
      '/api/budgets',
      '/api/categories',
      '/api/companies',
      '/api/projects'
    ]
  });
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(distPath, 'index.html'));
  } catch (err) {
    res.status(404).json({ 
      message: 'Frontend not built. This is API-only mode.',
      api_endpoints: '/api'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ 
      message: 'Duplicate entry', 
      field: Object.keys(err.keyPattern)[0] 
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(port, () => {
  console.log('\n🚀 Finance Tracker Server Started');
  console.log(`📱 Application: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});
