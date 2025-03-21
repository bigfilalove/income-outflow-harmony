
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string (local by default)
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-tracker';
    
    const conn = await mongoose.connect(connectionString);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
