const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied: No token provided.');

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key-123');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');
const companiesRoutes = require('./routes/companies');
const budgetsRoutes = require('./routes/budgets');
const predictionsRoutes = require('./routes/predictions');
const employeesRoutes = require('./routes/employees');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects'); // New route

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes); // Apply new route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
