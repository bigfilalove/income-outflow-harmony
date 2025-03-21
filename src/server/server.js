
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const predictionRoutes = require('./routes/predictions');
const userRoutes = require('./routes/users');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/predictions', predictionRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
  console.log(`Auth endpoints: http://localhost:${PORT}/auth/login and http://localhost:${PORT}/auth/register`);
  console.log(`Protected endpoints: http://localhost:${PORT}/transactions (requires authentication)`);
});
