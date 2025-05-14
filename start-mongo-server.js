
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

console.log('Starting server without MongoDB local setup...');
console.log('Using MongoDB URI from .env file');

// This is just a wrapper to start the real server file
require('./src/server/server');
